import { User } from '@/user/schemas';

export class UserResetPasswordEvent {
  constructor(public readonly user: User) {}

  static eventName = 'user.password.reset';

  static fromUser(user: User) {
    return new UserResetPasswordEvent(user);
  }
}
