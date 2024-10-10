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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Create a new user')
  create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  @ResponseMessage('Fetch list user with paginate')
  findAll(
    @Query('current') currentPage: string, // currentPage: string = req.query.page
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @ResponseMessage('Fetch user by id')
  @Get(':id')
  async findOne(
    @Param('id')
    id: number | null,
  ) {
    const foundUser = await this.usersService.findOne(id);
    return foundUser;
  }

  @Patch()
  @ResponseMessage('Update a user')
  update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    const updatedUser = this.usersService.update(updateUserDto, user);
    return updatedUser;
  }

  @Patch('upload-cv')
  @ResponseMessage('Upload cv by user')
  updateCVByUser(@Body() data: { urlCV: string }, @User() user: IUser) {
    const updatedUser = this.usersService.updateCVByUser(data, user);
    return updatedUser;
  }

  @ResponseMessage('Delete a user')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(+id, user);
  }
}
