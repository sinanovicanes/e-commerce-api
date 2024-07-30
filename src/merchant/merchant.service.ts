import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Merchant } from './schemas';
import { Model } from 'mongoose';
import { CreateMerchantDto } from './dtos';
import { User } from '@/user/schemas';
import { UserService } from '@/user/user.service';

@Injectable()
export class MerchantService {
  @Inject() private readonly userService: UserService;
  @InjectModel(Merchant.name) private readonly merchantModel: Model<Merchant>;

  async getMerchantById(merchantId: string) {
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
}
