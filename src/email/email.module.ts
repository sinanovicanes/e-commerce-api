import { MailerConfigService } from '@/config/services';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailEventHandlers } from './email.event-handlers';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailerConfigService,
    }),
  ],
  controllers: [],
  providers: [EmailService, EmailEventHandlers],
})
export class EmailModule {}
