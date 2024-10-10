import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ResponseMessage('Create a new job')
  create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Fetch jobs with pagination')
  findAll(
    @Query('current') currentPage: string, // currentPage: string = req.query.page
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.jobsService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get('get-param-occupation')
  @ResponseMessage('Get param occupation')
  getParamsOccupation() {
    return this.jobsService.getParamsOccupation();
  }

  @Public()
  @Get('get-total-jobs')
  @ResponseMessage('Get total jobs')
  getTotalJobs() {
    return this.jobsService.getTotalJobs();
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Fetch a job by id')
  findOne(@Param('id') id: number) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a job')
  update(
    @Param('id') id: number,
    @Body() updateJobDto: UpdateJobDto,
    @User() user: IUser,
  ) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a job')
  remove(@Param('id') id: number, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }

  @Public()
  @ResponseMessage('Get jobs suggest by cv')
  @Post('jobs-suggest')
  getJobsSuggest(
    @Query('current') currentPage: string, // currentPage: string = req.query.page
    @Query('pageSize') limit: string,
    @Query() qs: string,
    @Body() data: { fileName: string },
  ) {
    return this.jobsService.getJobsSuggest(
      +currentPage,
      +limit,
      qs,
      data.fileName,
    );
  }
}
