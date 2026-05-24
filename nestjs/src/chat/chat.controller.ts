import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ResponseMessage, User, SkipCheckPermissions } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @SkipCheckPermissions()
  @ResponseMessage('Send a message')
  @Post('send')
  create(@Body() createMessageDto: CreateMessageDto, @User() user: IUser) {
    return this.chatService.create(user.id, createMessageDto.content);
  }

  @SkipCheckPermissions()
  @ResponseMessage('Get chat history')
  @Get('history')
  findHistory(@User() user: IUser) {
    return this.chatService.findHistoryByUser(user.id);
  }

  @SkipCheckPermissions()
  @ResponseMessage('Get all users with messages')
  @Get('users')
  findUsersWithMessages() {
    return this.chatService.findUsersWithMessages();
  }

  @SkipCheckPermissions()
  @ResponseMessage('Get chat history for admin')
  @Get('history/:userId')
  findHistoryForAdmin(@Param('userId') userId: string) {
    return this.chatService.findHistoryForAdmin(+userId);
  }
}
