import { User } from '@/user/schemas';

export class UserRegisterEvent {
  static event = 'user.registered';

  constructor(public readonly user: User) {}
}
