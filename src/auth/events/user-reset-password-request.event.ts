import { User } from '@/user/schemas';

export class UserResetPasswordRequestEvent {
  constructor(
    public readonly user: User,
    public resetToken: string,
  ) {}

  static eventName = 'user.password.reset-request';
}
