import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { ProductService } from '../services';
import { Types } from 'mongoose';

@Injectable()
export class ProductGuard implements CanActivate {
  @Inject() private readonly productService: ProductService;

  private extractProductIdFromRequest(request: Request): Types.ObjectId | null {
    const productId =
      request.params.productId ??
      request.body.productId ??
      request.query.productId;

    if (!productId) {
      return null;
    }

    return Types.ObjectId.isValid(productId)
      ? new Types.ObjectId(productId)
      : null;
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const productId = this.extractProductIdFromRequest(request);

    if (!productId) {
      return false;
    }

    const product = await this.productService.getProductById(productId);

    if (!product) {
      return false;
    }

    request.product = product;

    return true;
  }
}
