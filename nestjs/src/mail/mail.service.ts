import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IMail } from './mail.controller';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserConfirmation(receiver: IMail) {
    const url = `${this.configService.get<string>(
      'URL_FRONTEND',
    )}/verify-interview?token=${receiver.token}`;

    await this.mailerService.sendMail({
      to: receiver.email,
      subject: receiver.title,
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: receiver.name,
        contentMail: receiver.contentMail,
        url,
      },
      //   html: receiver.contentMail,
    });
  }
}
