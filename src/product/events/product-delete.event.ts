import { Product } from '../schemas';

export class ProductDeleteEvent {
  static event = 'product.delete';

  constructor(public readonly product: Product) {}
}
