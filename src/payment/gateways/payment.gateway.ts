import { Order } from '@/order/schemas';

export abstract class PaymentGateway {
  abstract processPayment(order: Order): Promise<void>;
}
