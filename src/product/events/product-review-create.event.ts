import { ProductReview } from '../schemas';

export class ProductReviewCreateEvent {
  static event = 'product.review.create';

  constructor(public readonly review: ProductReview) {}
}
