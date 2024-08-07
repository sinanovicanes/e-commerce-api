import { Controller } from '@nestjs/common';
import { EmailService } from './email.service';
import { OnEvent } from '@nestjs/event-emitter';
import {
  UserRegisterEvent,
  UserResetPasswordRequestEvent,
} from '@/auth/events';
import { EmailType } from './enums';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(UserRegisterEvent.eventName, { async: true })
  async handleUserRegisterEvent(event: UserRegisterEvent) {
    await this.emailService.sendMail(EmailType.WELCOME, {
      to: event.user.email,
      subject: 'Welcome to our platform',
      context: {
        name: event.user.name,
      },
    });
  }

  @OnEvent(UserResetPasswordRequestEvent.eventName)
  async handleUserResetPasswordEvent(event: UserResetPasswordRequestEvent) {
    await this.emailService.sendMail(EmailType.RESET_PASSWORD, {
      to: event.user.email,
      subject: 'Reset your password',
      context: {
        name: event.user.name,
        // This should be the frontend URL with the reset token
        resetLink: `http://localhost:3000/reset-password/${event.resetToken}`,
      },
    });
  }
}
