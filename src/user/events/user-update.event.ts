import { UpdateUserDto } from '../dtos';
import { User } from '../schemas';

export class UserUpdateEvent {
  constructor(
    public readonly user: User,
    public updateDto: UpdateUserDto,
  ) {}

  static eventName = 'user.update';
}
