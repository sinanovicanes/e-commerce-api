import { Order } from '../schemas';

export class OrderCreatedEvent {
  static event = 'order.created';

  constructor(public readonly order: Order) {}
}
