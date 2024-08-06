import { Controller } from '@nestjs/common';
import { EmailService } from './email.service';
import { OnEvent } from '@nestjs/event-emitter';
import { UserRegisterEvent } from '@/auth/events';
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
}
