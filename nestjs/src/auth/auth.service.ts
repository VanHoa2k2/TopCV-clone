import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/user.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly rolesService: RolesService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid) {
        const userRole = user.role;
        const temp = (await this.rolesService.findOne(userRole.id)) as Role;

        const objUser = {
          ...user,
          permissions: temp?.permissions ?? [],
        };

        return objUser;
      }
    }
    return null;
  }

  async register(user: RegisterUserDto) {
    const newUser = await this.usersService.register(user);

    return {
      id: newUser?.id,
      createdAt: newUser?.createdAt,
    };
  }

  async login(user: IUser) {
    const {
      id,
      name,
      email,
      phone,
      urlCV,
      avatar,
      company,
      role,
      permissions,
    } = user;

    const payload = {
      sub: 'token login',
      iss: 'from server',
      id,
      name,
      email,
      phone,
      urlCV,
      avatar,
      company,
      role,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: ms(this.configService.get<string>('JWT_ACCESS_EXPIRE')) / 1000,
    });

    const refresh_token = this.createRefreshToken(payload);

    // update user with refresh token
    await this.usersService.updateUserToken(refresh_token, id);

    // set refresh_token as cookies
    // response.cookie('refresh_token', refresh_token, {
    //   httpOnly: true,
    //   maxAge: ms(this.configService.get<string>('JWT_Refresh_EXPIRE')),
    // });

    return {
      access_token,
      accessTokenExpires:
        new Date().getTime() +
        ms(this.configService.get<string>('JWT_ACCESS_EXPIRE')),
      refresh_token,
      user: {
        id,
        name,
        email,
        phone,
        urlCV,
        avatar,
        company,
        role,
        permissions,
      },
    };
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_Refresh_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_Refresh_EXPIRE')) / 1000,
    });
    return refresh_token;
  };

  processNewToken = async (refreshToken: string) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_Refresh_TOKEN_SECRET'),
      });

      const user = await this.usersService.findUserByToken(refreshToken);

      if (user) {
        const { id, name, email, phone, urlCV, avatar, company, role } = user;
        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          id,
          name,
          email,
          phone,
          urlCV,
          avatar,
          company,
          role,
        };

        const refresh_token = this.createRefreshToken(payload);

        // update user with refresh token
        await this.usersService.updateUserToken(refresh_token, id);

        const userRole = user.role;
        const temp = (await this.rolesService.findOne(userRole.id)) as Role;

        // set refresh_token as cookies
        // response.clearCookie('refresh_token');

        // response.cookie('refresh_token', refresh_token, {
        //   httpOnly: true,
        //   maxAge: ms(this.configService.get<string>('JWT_Refresh_EXPIRE')),
        // });
        return {
          access_token: this.jwtService.sign(payload),
          refresh_token,
          accessTokenExpires:
            new Date().getTime() +
            ms(this.configService.get<string>('JWT_ACCESS_EXPIRE')),
          user: {
            id,
            name,
            email,
            phone,
            role,
            urlCV,
            avatar,
            company,
            permissions: temp?.permissions,
          },
        };
      } else {
        throw new BadRequestException(
          'Refresh token không hợp lệ. Vui lòng login',
        );
      }
    } catch (error) {
      throw new BadRequestException(
        'Refresh token không hợp lệ. Vui lòng login',
      );
    }
  };

  logout = async (response: Response, user: IUser) => {
    await this.usersService.updateUserToken('', user.id);
    response.clearCookie('refresh_token');
    return 'ok';
  };
}
