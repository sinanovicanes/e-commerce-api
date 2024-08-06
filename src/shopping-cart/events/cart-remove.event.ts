import { ShoppingCart } from '../schemas';

export class CartRemoveEvent {
  constructor(
    public readonly cart: ShoppingCart,
    public readonly productId: string,
  ) {}

  static eventName = 'cart.remove';
}
