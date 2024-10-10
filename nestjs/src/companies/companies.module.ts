import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company, Field } from './entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Field])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
