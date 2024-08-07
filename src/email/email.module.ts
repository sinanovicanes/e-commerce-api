import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailEventHandlers } from './email.event-handlers';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAILER_HOST'),
          port: configService.get('MAILER_PORT'),
          auth: {
            user: configService.get('MAILER_USER'),
            pass: configService.get('MAILER_PASS'),
          },
        },
        template: {
          dir: `${__dirname}/templates`,
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
      }),
    }),
  ],
  controllers: [],
  providers: [EmailService, EmailEventHandlers],
})
export class EmailModule {}
