import { Injectable } from '@nestjs/common';
import { CreateNotifyDto } from './dto/create-notify.dto';
import { UpdateNotifyDto } from './dto/update-notify.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notify } from './entities/notify.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotifiesService {
  constructor(
    @InjectRepository(Notify)
    private notifiesRepository: Repository<Notify>,
  ) {}

  async create(createNotifyDto: CreateNotifyDto) {
    const { status, title, description, isActive, jobId, nameJob, user } =
      createNotifyDto;

    const newNotify = await this.notifiesRepository.create({
      status,
      title,
      description,
      isActive,
      jobId,
      nameJob,
      user: {
        id: user,
      },
    });
    await this.notifiesRepository.save(newNotify);
  }

  findAll() {
    return `This action returns all notifies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notify`;
  }

  async update(id: number, updateNotifyDto: UpdateNotifyDto) {
    await this.notifiesRepository.update(
      { id },
      {
        isActive: updateNotifyDto.isActive,
      },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} notify`;
  }
}
