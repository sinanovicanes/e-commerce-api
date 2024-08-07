import { ShoppingCart } from '../schemas';

export class CartRemoveEvent {
  static event = 'cart.remove';

  constructor(
    public readonly cart: ShoppingCart,
    public readonly productId: string,
  ) {}
}
