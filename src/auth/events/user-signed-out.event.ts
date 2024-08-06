import { User } from '@/user/schemas';

export class UserSignedOutEvent {
  constructor(public readonly user: User) {}

  static eventName = 'user.signed-out';

  static fromUser(user: User) {
    return new UserSignedOutEvent(user);
  }
}
