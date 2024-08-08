import { User } from '@/user/schemas';

export class UserResetPasswordRequestEvent {
  static event = 'user.password.reset-request';

  constructor(
    public readonly user: User,
    public resetToken: string,
  ) {}

  get email() {
    return this.user.email;
  }

  // This should be the frontend URL with the reset token
  get resetLink() {
    return `http://localhost:3000/reset-password?token=${this.resetToken}&email=${this.email}`;
  }
}
