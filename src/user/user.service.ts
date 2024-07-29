import { EncryptionService } from '@/encryption/encryption.service';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './schemas/User';

@Injectable()
export class UserService {
  @Inject() private readonly encryptionService: EncryptionService;
  @InjectModel(User.name) private readonly userModel: Model<User>;

  async updateUser(target: User | User['_id'], updateUserDto: UpdateUserDto) {
    if (Object.keys(updateUserDto).length === 0) {
      throw new HttpException('No data to update', HttpStatus.BAD_REQUEST);
    }

    const id = target instanceof User ? target._id : target;

    if (updateUserDto.password) {
      updateUserDto.password = await this.encryptionService.hashPassword(
        updateUserDto.password,
      );
    }

    const results = await this.userModel.findByIdAndUpdate(id, updateUserDto);

    if (!results) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return { message: 'User updated successfully' };
  }
}
