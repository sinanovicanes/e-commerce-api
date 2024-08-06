import { ProductReview } from '../schemas';

export class ProductReviewDeleteEvent {
  static eventName = 'product.review.delete';

  constructor(public readonly review: ProductReview) {}

  static fromReview(review: ProductReview) {
    return new ProductReviewDeleteEvent(review);
  }
}
