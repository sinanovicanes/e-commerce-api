import { User } from '@/user/schemas';

export class UserResetPasswordEvent {
  static event = 'user.password.reset';

  constructor(public readonly user: User) {}
}
