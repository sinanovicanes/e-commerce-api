import { ShoppingCart } from '../schemas';

export class CartAddEvent {
  constructor(
    public readonly cart: ShoppingCart,
    public readonly productId: string,
    public readonly quantity: number,
  ) {}

  static eventName = 'cart.add';
}
