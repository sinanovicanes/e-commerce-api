import { ShoppingCart } from '../schemas';

export class CartClearEvent {
  static event = 'cart.clear';

  constructor(public readonly cart: ShoppingCart) {}
}
