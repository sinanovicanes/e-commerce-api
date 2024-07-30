import { UserService } from '@/user/user.service';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  @Inject() private readonly userService: UserService;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => this.extractJwtFromCookie(req),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  private extractJwtFromCookie(req: Request): string {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new UnauthorizedException('Access token not found');
    }

    return token;
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.getUserByIdUsingCache(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
