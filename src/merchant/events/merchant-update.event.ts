import { UpdateMerchantDto } from '../dtos';
import { Merchant } from '../schemas';

export class MerchantUpdateEvent {
  constructor(
    public readonly merchant: Merchant,
    public updateDto: UpdateMerchantDto,
  ) {}

  static eventName = 'merchant.update';

  static fromMerchant(merchant: Merchant, updateDto: UpdateMerchantDto) {
    return new MerchantUpdateEvent(merchant, updateDto);
  }
}
