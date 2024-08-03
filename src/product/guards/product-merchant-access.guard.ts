import { Merchant } from '@/merchant/schemas';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Product } from '../schemas';

@Injectable()
export class ProductMerchantAccessGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const merchant = request.merchant as Merchant;
    const product = request.product as Product;

    if (!merchant || !product) {
      return false;
    }

    return merchant._id.toString() === product.merchant.toString();
  }
}
