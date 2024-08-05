import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '../schemas';

export const GetProduct = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const product = request.product as Product;

    if (!product) throw new NotFoundException('Product not found');

    return data ? product[data] : product;
  },
);
