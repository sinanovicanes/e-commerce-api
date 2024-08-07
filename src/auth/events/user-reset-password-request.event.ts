import { User } from '@/user/schemas';

export class UserResetPasswordRequestEvent {
  static event = 'user.password.reset-request';

  constructor(
    public readonly user: User,
    public resetToken: string,
  ) {}
}
