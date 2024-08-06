import { Merchant } from '../schemas';

export class MerchantCreateEvent {
  constructor(public readonly merchant: Merchant) {}

  static eventName = 'merchant.create';

  static fromMerchant(merchant: Merchant) {
    return new MerchantCreateEvent(merchant);
  }
}
