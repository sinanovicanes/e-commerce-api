import { EncryptionService } from '@/encryption/encryption.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from '../dtos';
import { UserUpdateEvent } from '../events';
import { User } from '../schemas';

@Injectable()
export class UserService {
  @Inject() private readonly encryptionService: EncryptionService;
  @InjectModel(User.name) private readonly userModel: Model<User>;
  @Inject() private readonly eventEmitter: EventEmitter2;

  async findUserById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId);
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
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

    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    this.eventEmitter.emit(
      UserUpdateEvent.event,
      new UserUpdateEvent(user, updateUserDto),
    );

    return { message: 'User updated successfully' };
  }
}
