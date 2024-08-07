import { Types } from 'mongoose';
import { ShoppingCart } from '../schemas';

export class CartUpdateQuantityEvent {
  static event = 'cart.update-quantity';

  constructor(
    public readonly cart: ShoppingCart,
    public readonly productId: Types.ObjectId,
    public readonly quantity: number,
  ) {}
}
