import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/User';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  @InjectModel(User.name) private readonly userModel: Model<User>;

  async updateUser(target: User | User['_id'], updateUserDto: UpdateUserDto) {
    if (Object.keys(updateUserDto).length === 0) {
      throw new HttpException('No data to update', HttpStatus.BAD_REQUEST);
    }

    const id = target instanceof User ? target._id : target;

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const results = await this.userModel.findByIdAndUpdate(id, updateUserDto);

    if (!results) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return { message: 'User updated successfully' };
  }
}
