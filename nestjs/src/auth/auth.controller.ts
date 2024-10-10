import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
import { IUser } from 'src/users/user.interface';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/entities/role.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly rolesService: RolesService,
  ) {}
  //tham khảo: https://www.loginradius.com/blog/engineering/guest-post/session-authentication-with-nestjs-and-mongodb/
  //https://www.loginradius.com/blog/engineering/guest-post/session-authentication-with-nestjs-and-mongodb/

  @Public()
  @ResponseMessage('User login')
  @UseGuards(LocalAuthGuard) // chạy trước
  @Post('/login')
  handleLogin(@Req() req) {
    return this.authService.login(req.user);
  }

  @ResponseMessage('Get user information')
  @Get('/account')
  async handleGetAccount(@User() user: IUser) {
    const temp = (await this.rolesService.findOne(user?.role?.id)) as Role;
    user.permissions = temp?.permissions;
    return { user };
  }

  @Public()
  @ResponseMessage('Register a new user')
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Public()
  @ResponseMessage('Get User by refresh token')
  @Post('/refresh')
  handleRefreshToken(@Body() refreshTokenDto: { refreshToken: string }) {
    const { refreshToken } = refreshTokenDto;
    return this.authService.processNewToken(refreshToken);
  }

  @ResponseMessage('Logout User')
  @Post('/logout')
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser,
  ) {
    return this.authService.logout(response, user);
  }
}
