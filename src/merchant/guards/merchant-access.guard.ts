import { User } from '@/user/schemas';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { HeaderFields } from '../enums';
import { MerchantService } from '../merchant.service';
import { Merchant } from '../schemas';

@Injectable()
export class MerchantAccessGuard implements CanActivate {
  @Inject() private readonly merchantService: MerchantService;

  private extractMerchantIdFromRequest(req: Request): Types.ObjectId | null {
    const merchantId = req.headers[HeaderFields.MERCHANT_ID] as string;

    return Types.ObjectId.isValid(merchantId)
      ? new Types.ObjectId(merchantId)
      : null;
  }

  private isOwner(merchant: Merchant, userId: Types.ObjectId): boolean {
    return merchant.ownerId.toString() === userId.toString();
  }

  private isMember(merchant: Merchant, userId: Types.ObjectId): boolean {
    const isOwner = this.isOwner(merchant, userId);

    if (isOwner) {
      return true;
    }

    return merchant.users.some((user: User | Types.ObjectId) => {
      const id = user instanceof User ? user._id : user;
      return id.toString() == userId.toString();
    });
  }

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      return false;
    }

    const merchantId = this.extractMerchantIdFromRequest(req);

    if (!merchantId) {
      return false;
    }

    const merchant = await this.merchantService.getMerchantById(merchantId);

    if (!merchant) {
      return false;
    }

    if (!this.isMember(merchant, user._id)) {
      return false;
    }

    req.merchant = merchant;

    return true;
  }
}
