import { Module } from '@nestjs/common';
import { NotifiesService } from './notifies.service';
import { NotifiesController } from './notifies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notify } from './entities/notify.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notify])],
  controllers: [NotifiesController],
  providers: [NotifiesService],
})
export class NotifiesModule {}
