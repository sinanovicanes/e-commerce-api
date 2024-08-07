import { ProductReview } from '../schemas';

export class ProductReviewDeleteEvent {
  static event = 'product.review.delete';

  constructor(public readonly review: ProductReview) {}
}
