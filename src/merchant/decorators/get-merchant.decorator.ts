import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Merchant } from '../schemas';

export const GetMerchant = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const merchant = request.merchant as Merchant;

    if (!merchant) throw new NotFoundException('Merchant not found');

    return data ? merchant[data] : merchant;
  },
);
