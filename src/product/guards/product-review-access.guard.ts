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

    if (!user) {
      return false;
    }

    const reviewId = this.extractProductReviewIdFromRequest(request);

    if (!reviewId) {
      return false;
    }

    const review = await this.productReviewService.findReviewById(reviewId);

    if (!review) {
      return false;
    }

    return review.user.toString() === user._id.toString();
  }
}
