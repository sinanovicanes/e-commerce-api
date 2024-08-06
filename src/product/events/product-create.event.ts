import { Product } from '../schemas';

export class ProductCreateEvent {
  constructor(public readonly product: Product) {}

  static eventName = 'product.create';

  static fromProduct(product: Product) {
    return new ProductCreateEvent(product);
  }
}
