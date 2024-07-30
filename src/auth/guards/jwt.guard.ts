import { UserService } from '@/user/user.service';
import { CanActivate, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { CookieFields } from '../enums';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  @Inject() private readonly userService: UserService;
  @Inject() private readonly authService: AuthService;
  @Inject() private readonly jwtService: JwtService;
  @Inject() private readonly configService: ConfigService;
  private readonly reflector: Reflector = new Reflector();

  private extractJwtTokenFromCookie(
    req: Request,
    field: CookieFields = CookieFields.ACCESS_TOKEN,
  ) {
    return req.cookies[field];
  }

  private async validateByAccessToken(req: Request) {
    const accessToken = this.extractJwtTokenFromCookie(req);

    if (!accessToken) {
      return false;
    }

    try {
      const payload: JwtPayload = this.jwtService.verify(accessToken);
      const user = await this.userService.getUserByIdUsingCache(payload.sub);

      if (!user) {
        return false;
      }

      req.user = user;

      return true;
    } catch {
      return false;
    }
  }

  private async validateByRefreshToken(req: Request) {
    const refreshToken = this.extractJwtTokenFromCookie(
      req,
      CookieFields.REFRESH_TOKEN,
    );

    if (!refreshToken) {
      return false;
    }

    try {
      const payload: JwtPayload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.userService.getUserByIdUsingCache(payload.sub);

      if (!user) {
        return false;
      }

      const isValidToken = await this.authService.validateRefreshToken(
        user,
        refreshToken,
      );

      if (!isValidToken) {
        return false;
      }

      req.user = user;

      // Update the user tokens in the cookies
      await this.authService.setUserTokensInCookies(user, req.res);

      return true;
    } catch {
      return false;
    }
  }

  async canActivate(context: any) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    // Check if the request is valid by access token or refresh token
    const isValidRequest =
      (await this.validateByAccessToken(req)) ||
      (await this.validateByRefreshToken(req));

    return isValidRequest;
  }
}
