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
import { ResumesService } from './resumes.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { CreateUserCvDto, UploadCvDto } from './dto/create-resume.dto';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Create a new resume')
  create(@Body() CreateUserCvDto: CreateUserCvDto, @User() user: IUser) {
    return this.resumesService.create(CreateUserCvDto, user);
  }

  @Post('upload-cv')
  @ResponseMessage('Upload CV for user')
  uploadCV(@Body() UploadCvDto: UploadCvDto, @User() user: IUser) {
    return this.resumesService.uploadCV(UploadCvDto, user);
  }

  @Get()
  @ResponseMessage('Fetch all resumes with paginate')
  findAll(
    @Query('current') currentPage: string, // currentPage: string = req.query.page
    @Query('pageSize') limit: string,
    @Query() qs: string,
    // @User() user: IUser,
  ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch a resume by id')
  findOne(@Param('id') id: number) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update status resume')
  update(
    @Param('id') id: number,
    @Body('status') status: string,
    @User() user: IUser,
  ) {
    return this.resumesService.update(id, status, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a resume by id')
  remove(@Param('id') id: number, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }

  @Post('by-user')
  @ResponseMessage('Get Resumes by User')
  getCvByUser(@User() user: IUser) {
    return this.resumesService.getCvByUser(user);
  }

  @Post('/fetch-resumes-suggest')
  @ResponseMessage('Fetch all resumes suggest')
  fetchResumesSuggest(
    @Query('current') currentPage: string, // currentPage: string = req.query.page
    @Query('pageSize') limit: string,
    @Query() qs: string,
    @Body() data: { jobId: number },
  ) {
    return this.resumesService.getResumesSuggest(
      +currentPage,
      +limit,
      qs,
      data.jobId,
    );
  }

  @Public()
  @Post('confirm-interview')
  @ResponseMessage('Post confirm interview')
  conformInterview(@Body() data: { token: string }) {
    return this.resumesService.conformInterview(data.token);
  }
}
