import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job, Skill, Occupation } from './entities/job.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Skill, Occupation])],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
