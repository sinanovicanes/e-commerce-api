import { User } from '@/user/schemas/User';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  @Inject() private readonly jwtService: JwtService;
  @InjectModel(User.name) private readonly userModel: Model<User>;
  @Inject(CACHE_MANAGER) private readonly cacheManager: Cache;

  private extractTokenFromRequest(request: Request): string {
    const [bearer, token] = request.headers.authorization?.split(' ') ?? [];

    return bearer === 'Bearer' ? token : null;
  }

  private async getUserById(userId: string): Promise<User | undefined> {
    const cacheKey = `user:${userId}`;
    const user = await this.cacheManager.get<User>(cacheKey);

    if (user === undefined) {
      const userDocument = await this.userModel.findById(userId);

      await this.cacheManager.set(cacheKey, userDocument ?? false);

      return userDocument;
    }

    return user;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      return false;
    }

    try {
      const payload = await this.jwtService.verify(token);
      const user = await this.getUserById(payload.sub);

      if (!user) return false;

      request.user = user;
    } catch {
      return false;
    }

    return true;
  }
}
