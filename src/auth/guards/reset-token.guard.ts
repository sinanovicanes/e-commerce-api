import { UserService } from '@/user/services';
import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';

export class ResetTokenGuard implements CanActivate {
  @Inject() private readonly authService: AuthService;
  @Inject() private readonly userService: UserService;
  @Inject() private readonly jwtService: JwtService;
  @Inject() private readonly configService: ConfigService;

  private extractTokenFromRequest(req: Request): string {
    return req.params.token;
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(req);

    if (!token) {
      return false;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_RESET_SECRET'),
      });
      const user = await this.userService.getUserByIdUsingCache(payload.sub);

      if (!user) {
        return false;
      }

      const isValidToken = this.authService.validateResetToken(user, token);

      if (!isValidToken) {
        return false;
      }

      req.user = user;
    } catch {
      return false;
    }

    return true;
  }
}
