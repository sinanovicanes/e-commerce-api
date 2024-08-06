import { User } from '@/user/schemas';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateMerchantDto, UpdateMerchantDto } from './dtos';
import { Merchant } from './schemas';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MerchantCreateEvent, MerchantUpdateEvent } from './events';

@Injectable()
export class MerchantService {
  @Inject() private readonly eventEmitter: EventEmitter2;
  @InjectModel(Merchant.name) private readonly merchantModel: Model<Merchant>;

  async getMerchantById(merchantId: Types.ObjectId) {
    const merchant = await this.merchantModel.findById(merchantId);

    if (!merchant) {
      throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);
    }

    return merchant;
  }

  async createMerchant(createMerchantDto: CreateMerchantDto, owner: User) {
    const merchant = new this.merchantModel({
      ...createMerchantDto,
      owner,
    });

    try {
      await merchant.save();
    } catch {
      throw new HttpException(
        'Email is already being used by another merchant',
        HttpStatus.CONFLICT,
      );
    }

    this.eventEmitter.emit(
      MerchantCreateEvent.eventName,
      MerchantCreateEvent.fromMerchant(merchant),
    );

    return {
      message: 'Merchant created successfully',
      merchant: {
        id: merchant._id,
        name: merchant.name,
        address: merchant.address,
        phone: merchant.phone,
        email: merchant.email,
      },
    };
  }

  async updateMerchant(
    target: Merchant | Merchant['_id'],
    updateMerchantDto: UpdateMerchantDto,
  ) {
    if (Object.keys(updateMerchantDto).length === 0) {
      throw new BadRequestException('At least one field must be updated');
    }

    const merchantId = target instanceof Merchant ? target._id : target;
    const merchant = await this.merchantModel.findByIdAndUpdate(
      merchantId,
      updateMerchantDto,
      { new: true },
    );

    this.eventEmitter.emit(
      MerchantUpdateEvent.eventName,
      MerchantUpdateEvent.fromMerchant(merchant, updateMerchantDto),
    );

    return merchant;
  }
}
