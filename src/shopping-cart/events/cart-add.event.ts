import { ShoppingCart } from '../schemas';

export class CartAddEvent {
  static event = 'cart.add';

  constructor(
    public readonly cart: ShoppingCart,
    public readonly productId: string,
    public readonly quantity: number,
  ) {}
}
