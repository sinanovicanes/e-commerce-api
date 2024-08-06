import { ProductReview } from '../schemas';

export class ProductReviewCreateEvent {
  static eventName = 'product.review.create';

  constructor(public readonly review: ProductReview) {}

  static fromReview(review: ProductReview) {
    return new ProductReviewCreateEvent(review);
  }
}
