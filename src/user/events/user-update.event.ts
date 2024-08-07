import { UpdateUserDto } from '../dtos';
import { User } from '../schemas';

export class UserUpdateEvent {
  static event = 'user.update';

  constructor(
    public readonly user: User,
    public updateDto: UpdateUserDto,
  ) {}
}
