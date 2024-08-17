import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
  @Inject() private readonly configService: ConfigService;

  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: this.configService.get('MAILER_HOST'),
        port: this.configService.get('MAILER_PORT'),
        auth: {
          user: this.configService.get('MAILER_USER'),
          pass: this.configService.get('MAILER_PASS'),
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
    };
  }
}
