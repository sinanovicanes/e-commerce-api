import { Types } from 'mongoose';
import { ShoppingCart } from '../schemas';

export class CartUpdateQuantityEvent {
  constructor(
    public readonly cart: ShoppingCart,
    public readonly productId: Types.ObjectId,
    public readonly quantity: number,
  ) {}

  static eventName = 'cart.update-quantity';
}
