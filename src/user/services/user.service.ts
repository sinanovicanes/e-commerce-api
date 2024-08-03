import { EncryptionService } from '@/encryption/encryption.service';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from '../dtos';
import { User } from '../schemas';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
  @Inject() private readonly encryptionService: EncryptionService;
  @InjectModel(User.name) private readonly userModel: Model<User>;
  @Inject(CACHE_MANAGER) private readonly cacheManager: Cache;

  async getUserByIdUsingCache(userId: string): Promise<User | undefined> {
    const cacheKey = `user:${userId}`;
    const user = await this.cacheManager.get<User>(cacheKey);

    if (user === undefined) {
      const userDocument = await this.userModel.findById(userId);

      await this.cacheManager.set(cacheKey, userDocument ?? false);

      return userDocument;
    }

    return user;
  }

  async updateUser(target: User | User['_id'], updateUserDto: UpdateUserDto) {
    if (Object.keys(updateUserDto).length === 0) {
      throw new HttpException('No data to update', HttpStatus.BAD_REQUEST);
    }

    const id = target instanceof User ? target._id : target;

    if (updateUserDto.password) {
      updateUserDto.password = await this.encryptionService.hash(
        updateUserDto.password,
      );
    }

    const results = await this.userModel.findByIdAndUpdate(id, updateUserDto);

    if (!results) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return { message: 'User updated successfully' };
  }

  async getUserMerchantsCount(userId: string) {
    return this.userModel.aggregate([
      { $match: { _id: userId } },
      {
        $lookup: {
          from: 'merchants',
          localField: '_id',
          foreignField: 'owner',
          as: 'merchants',
        },
      },
      { $project: { merchantsCount: { $size: '$merchants' } } },
    ]);
  }
}
