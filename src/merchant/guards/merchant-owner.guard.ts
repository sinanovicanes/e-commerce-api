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
export class MerchantOwnerGuard implements CanActivate {
  @Inject() private readonly merchantService: MerchantService;

  private extractMerchantIdFromRequest(req: Request): Types.ObjectId | null {
    const merchantId = req.headers[HeaderFields.MERCHANT_ID] as string;

    return Types.ObjectId.isValid(merchantId)
      ? new Types.ObjectId(merchantId)
      : null;
  }

  private isOwner(merchant: Merchant, userId: Types.ObjectId): boolean {
    return merchant.ownerId === userId;
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

    const isOwner = this.isOwner(merchant, user._id);

    if (!isOwner) {
      return false;
    }

    req.merchant = merchant;

    return true;
  }
}
