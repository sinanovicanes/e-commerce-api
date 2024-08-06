import { User } from '@/user/schemas';

export class UserRegisterEvent {
  constructor(public readonly user: User) {}

  static eventName = 'user.registered';

  static fromUser(user: User) {
    return new UserRegisterEvent(user);
  }
}
