import {
  UserRegisterEvent,
  UserResetPasswordEvent,
  UserResetPasswordRequestEvent,
} from '@/auth/events';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from './email.service';
import { EmailType } from './enums';

@Injectable()
export class EmailEventHandlers {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(UserRegisterEvent.event, { async: true })
  async handleUserRegisterEvent(event: UserRegisterEvent) {
    await this.emailService.sendMail(EmailType.WELCOME, {
      to: event.user.email,
      subject: 'Welcome to our platform',
      context: {
        name: event.user.name,
      },
    });
  }

  @OnEvent(UserResetPasswordRequestEvent.event)
  async handleUserResetPasswordRequestEvent(
    event: UserResetPasswordRequestEvent,
  ) {
    await this.emailService.sendMail(EmailType.PASSWORD_RESET_REQUEST, {
      to: event.user.email,
      subject: 'Reset your password',
      context: {
        name: event.user.name,
        // This should be the frontend URL with the reset token
        resetLink: `http://localhost:3000/reset-password/${event.resetToken}`,
      },
    });
  }

  @OnEvent(UserResetPasswordEvent.event, { async: true })
  async handleUserResetPasswordEvent(event: UserResetPasswordEvent) {
    await this.emailService.sendMail(EmailType.PASSWORD_RESET_SUCCESS, {
      to: event.user.email,
      subject: 'Password reset successful',
      context: {
        name: event.user.name,
      },
    });
  }
}
