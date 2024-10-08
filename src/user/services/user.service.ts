import { EncryptionService } from '@/encryption/encryption.service';
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
import { CreateUserDto, UpdateUserDto } from '../dtos';
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

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const hashedPassword = await this.encryptionService.hash(password);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    try {
      await user.save();
    } catch {
      throw new HttpException(
        'This username or email is already exist.',
        HttpStatus.CONFLICT,
      );
    }

    return user;
  }

  async getOrCreateUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findUserByEmail(createUserDto.email);

    if (!!user) {
      return user;
    }

    const newUser = await this.createUser(createUserDto);

    return newUser;
  }

  async updateUser(
    target: User | User['_id'],
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (Object.keys(updateUserDto).length === 0) {
      throw new HttpException('No data to update', HttpStatus.BAD_REQUEST);
    }

    const id = target instanceof User ? target._id : target;
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.eventEmitter.emit(
      UserUpdateEvent.event,
      new UserUpdateEvent(user, updateUserDto),
    );

    return user;
  }

  async updateUserPassword(
    target: User | User['_id'],
    password: string,
  ): Promise<User> {
    const hashedPassword = await this.encryptionService.hash(password);
    const id = target instanceof User ? target._id : target;
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true },
    );

    return user;
  }
}
