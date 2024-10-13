import { Body, Controller, Post } from '@nestjs/common';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailService } from './mail.service';

export interface IMail {
  email: string;
  name: string;
  nameJob: string;
  title: string;
  contentMail: string;
  token: string;
}

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Post()
  @ResponseMessage('Send mail confirm')
  create(@Body() receiver: IMail) {
    console.log(receiver);
    return this.mailService.sendUserConfirmation(receiver);
  }
}
