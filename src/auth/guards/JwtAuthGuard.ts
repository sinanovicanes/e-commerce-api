import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtService: JwtService;

  private extractTokenFromRequest(request: Request): string {
    const [bearer, token] = request.headers.authorization?.split(' ') ?? [];

    return bearer === 'Bearer' ? token : null;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      return false;
    }

    try {
      const payload = await this.jwtService.verify(token);

      request.user = payload;
    } catch {
      return false;
    }

    return true;
  }
}
