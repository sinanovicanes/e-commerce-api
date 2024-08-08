import { UserService } from '@/user/services';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isEmail } from 'class-validator';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class ResetTokenGuard implements CanActivate {
  @Inject() private readonly authService: AuthService;
  @Inject() private readonly userService: UserService;

  private extractEmailAndTokenFromRequest(req: Request): [string, string] {
    const email = req.query.email as string;
    const token = req.query.token as string;

    if (!email || !token || !isEmail(email) || typeof token !== 'string') {
      throw new BadRequestException('Invalid request');
    }

    return [email, token];
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const [email, token] = this.extractEmailAndTokenFromRequest(req);
    const user = await this.userService.getUserByEmail(email);
    const isValidToken = await this.authService.validateResetToken(user, token);

    if (!isValidToken) {
      throw new UnauthorizedException('Invalid token');
    }

    req.user = user;

    return true;
  }
}
