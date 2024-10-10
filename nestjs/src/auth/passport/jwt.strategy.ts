import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/user.interface';
import { Role } from 'src/roles/entities/role.entity';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly rolesService: RolesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: IUser) {
    const { id, name, email, phone, role, urlCV, avatar, company, notifies } =
      payload;
    // cần gán thêm permission vào req.user
    const temp = (await this.rolesService.findOne(role.id)) as Role;

    // req.user
    return {
      id,
      name,
      email,
      phone,
      role,
      urlCV,
      avatar,
      company,
      notifies,
      permissions: temp?.permissions ?? [],
    };
  }
}
