import { User } from '@/user/schemas';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { ProductReviewService } from '../services';
import { Product } from '../schemas';

@Injectable()
export class ProductReviewAccessGuard implements CanActivate {
  @Inject() private readonly productReviewService: ProductReviewService;

  private extractProductReviewIdFromRequest(
    request: Request,
  ): Types.ObjectId | null {
    const productReviewId =
      request.params.reviewId ??
      request.body.reviewId ??
      request.query.reviewId;

    if (!productReviewId) {
      return null;
    }

    return Types.ObjectId.isValid(productReviewId)
      ? new Types.ObjectId(productReviewId)
      : null;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const product = request.product as Product;

    if (!user || !product) {
      return false;
    }

    const reviewId = this.extractProductReviewIdFromRequest(request);

    if (!reviewId) {
      return false;
    }

    const review = await this.productReviewService.getReviewById(reviewId);

    if (!review) {
      return false;
    }

    // Check if the review is related to the product
    if (review.product.toString() !== product._id.toString()) {
      return false;
    }

    return review.user.toString() === user._id.toString();
  }
}
