import { UpdateMerchantDto } from '../dtos';
import { Merchant } from '../schemas';

export class MerchantUpdateEvent {
  static event = 'merchant.update';

  constructor(
    public readonly merchant: Merchant,
    public updateDto: UpdateMerchantDto,
  ) {}
}
