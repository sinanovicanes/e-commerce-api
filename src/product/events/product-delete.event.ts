import { Product } from '../schemas';

export class ProductDeleteEvent {
  constructor(public readonly product: Product) {}

  static eventName = 'product.delete';

  static fromProduct(product: Product) {
    return new ProductDeleteEvent(product);
  }
}
