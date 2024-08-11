import { User } from '@/user/schemas';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
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

  async findMerchantById(merchantId: Types.ObjectId): Promise<Merchant | null> {
    return this.merchantModel.findById(merchantId);
  }

  async getMerchantById(merchantId: Types.ObjectId): Promise<Merchant> {
    const merchant = await this.findMerchantById(merchantId);

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return merchant;
  }

  async createMerchant(
    createMerchantDto: CreateMerchantDto,
    owner: User,
  ): Promise<Merchant> {
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
      MerchantCreateEvent.event,
      new MerchantCreateEvent(merchant),
    );

    return merchant;
  }

  async updateMerchant(
    target: Merchant | Merchant['_id'],
    updateMerchantDto: UpdateMerchantDto,
  ): Promise<Merchant> {
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
      MerchantUpdateEvent.event,
      new MerchantUpdateEvent(merchant, updateMerchantDto),
    );

    return merchant;
  }

  async getUsersByMerchantId(merchantId: Types.ObjectId): Promise<User[]> {
    const merchant = await this.getMerchantById(merchantId);

    await merchant.populate('users', 'username name lastname email avatar');

    return merchant.users as User[];
  }

  async addUserToMerchant(
    target: Merchant | Types.ObjectId,
    user: User,
  ): Promise<Merchant> {
    const merchantId = target instanceof Merchant ? target._id : target;
    const merchant = await this.merchantModel.findByIdAndUpdate(
      merchantId,
      {
        $addToSet: { users: user._id },
      },
      { new: true },
    );

    return merchant;
  }

  async removeUserFromMerchant(
    target: Merchant | Types.ObjectId,
    targetUser: User | Types.ObjectId,
  ): Promise<Merchant> {
    const merchantId = target instanceof Merchant ? target._id : target;
    const userId = targetUser instanceof User ? targetUser._id : targetUser;
    const merchant = await this.merchantModel.findByIdAndUpdate(
      merchantId,
      {
        $pull: { users: userId },
      },
      { new: true },
    );

    return merchant;
  }
}
