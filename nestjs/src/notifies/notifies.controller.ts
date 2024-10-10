import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotifiesService } from './notifies.service';
import { CreateNotifyDto } from './dto/create-notify.dto';
import { UpdateNotifyDto } from './dto/update-notify.dto';
import { Public, ResponseMessage } from 'src/decorator/customize';

@Controller('notifies')
export class NotifiesController {
  constructor(private readonly notifiesService: NotifiesService) {}

  @Public()
  @ResponseMessage('Create a new notify')
  @Post()
  create(@Body() createNotifyDto: CreateNotifyDto) {
    return this.notifiesService.create(createNotifyDto);
  }

  @Get()
  findAll() {
    return this.notifiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notifiesService.findOne(+id);
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotifyDto: UpdateNotifyDto) {
    return this.notifiesService.update(+id, updateNotifyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notifiesService.remove(+id);
  }
}
