import { ShoppingCart } from '../schemas';

export class CartClearEvent {
  constructor(public readonly cart: ShoppingCart) {}

  static eventName = 'cart.clear';
}
