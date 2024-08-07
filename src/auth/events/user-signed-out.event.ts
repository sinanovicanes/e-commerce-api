import { User } from '@/user/schemas';

export class UserSignedOutEvent {
  static event = 'user.signed-out';

  constructor(public readonly user: User) {}
}
