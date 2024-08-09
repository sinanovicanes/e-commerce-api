import { UserService } from '@/user/services';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';

@Injectable()
export class AddUserGuard implements CanActivate {
  @Inject() private readonly userService: UserService;

  private extractTargetUserIdFromRequest(req: Request) {
    const userId = req.body.userId;

    if (!userId) {
      return null;
    }

    return Types.ObjectId.isValid(userId) ? userId : null;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = this.extractTargetUserIdFromRequest(req);

    if (!userId) {
      return false;
    }

    const user = await this.userService.findUserById(userId);

    if (!user) {
      return false;
    }

    req.targetUser = user;

    return true;
  }
}
