import { Inject, Injectable } from '@nestjs/common';
import { EmailType } from './enums';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  @Inject() private readonly mailerService: MailerService;

  async sendMail(type: EmailType, options: ISendMailOptions) {
    return this.mailerService.sendMail({
      ...options,
      template: type,
    });
  }
}
