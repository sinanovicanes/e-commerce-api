import { Product } from '../schemas';

export class ProductCreateEvent {
  static event = 'product.create';

  constructor(public readonly product: Product) {}
}
