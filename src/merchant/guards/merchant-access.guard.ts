import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { MerchantService } from '../merchant.service';
import { Types } from 'mongoose';
import { HeaderFields } from '../enums';

@Injectable()
export class MerchantAccessGuard implements CanActivate {
  @Inject() private readonly merchantService: MerchantService;

  private extractMerchantIdFromRequest(req: Request): Types.ObjectId | null {
    const merchantId = req.headers[HeaderFields.MERCHANT_ID] as string;

    return Types.ObjectId.isValid(merchantId)
      ? new Types.ObjectId(merchantId)
      : null;
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

    if (merchant.owner.toString() !== user._id.toString()) {
      return false;
    }

    req.merchant = merchant;

    return true;
  }
}
