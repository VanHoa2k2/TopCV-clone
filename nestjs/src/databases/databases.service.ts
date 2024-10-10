import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,

    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');

    if (Boolean(isInit)) {
      const countUser = await this.usersRepository.count({});
      const countRole = await this.rolesRepository.count({});
      const countPermission = await this.permissionsRepository.count({});

      //create permissions
      if (countPermission === 0) {
        const bulkCreatePermissions =
          await this.permissionsRepository.create(INIT_PERMISSIONS); // bulk create
        await this.permissionsRepository.save(bulkCreatePermissions);
      }

      // create role
      if (countRole === 0) {
        const permissions = await this.permissionsRepository.find();
        const bulkCreateRoles = await this.rolesRepository.create([
          {
            name: ADMIN_ROLE,
            description: 'Admin thì full quyền :v',
            isActive: true,
            permissions: permissions,
          },
          {
            name: USER_ROLE,
            description: 'Người dùng/Ứng viên sử dụng hệ thống',
            isActive: true,
            permissions: [], //không set quyền, chỉ cần add ROLE
          },
        ]);
        await this.rolesRepository.save(bulkCreateRoles);
      }

      // create user
      if (countUser === 0) {
        const adminRole = await this.rolesRepository.findOne({
          where: { name: ADMIN_ROLE },
        });
        const userRole = await this.rolesRepository.findOne({
          where: { name: USER_ROLE },
        });
        const initUser = await this.usersRepository.create([
          {
            name: "I'm admin",
            email: 'admin@gmail.com',
            password: this.userService.getHashPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            age: 22,
            gender: 'MALE',
            address: 'VietNam',
            role: {
              id: adminRole.id,
            },
          },
          {
            name: "I'm normal user",
            email: 'user@gmail.com',
            password: this.userService.getHashPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            age: 22,
            gender: 'MALE',
            address: 'VietNam',
            role: {
              id: userRole.id,
            },
          },
        ]);
        this.usersRepository.save(initUser);
      }
      if (countUser > 0 && countRole > 0 && countPermission > 0) {
        this.logger.log('>>> ALREADY INIT SAMPLE DATA...');
      }
    }
  }
}
