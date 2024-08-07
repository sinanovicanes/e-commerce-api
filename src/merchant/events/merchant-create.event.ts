import { Merchant } from '../schemas';

export class MerchantCreateEvent {
  static event = 'merchant.create';

  constructor(public readonly merchant: Merchant) {}
}
