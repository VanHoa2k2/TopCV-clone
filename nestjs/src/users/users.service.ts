import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { IUser } from './user.interface';
import aqp from 'api-query-params';
import { Role } from 'src/roles/entities/role.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private configService: ConfigService,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async register(user: RegisterUserDto) {
    const { name, email, password, address, age, gender, role, company } = user;
    //add logic check email
    const isExist = await this.usersRepository.findOne({ where: { email } });
    if (isExist) {
      throw new BadRequestException(
        `Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`,
      );
    }
    const hashPassword = this.getHashPassword(password);

    const newRegister = await this.usersRepository.create({
      email,
      password: hashPassword,
      name,
      age,
      gender,
      address,
      role: {
        id: role?.id,
      },
      company: {
        id: company?.id,
      },
    });

    return await this.usersRepository.save(newRegister);
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const {
      name,
      email,
      password,
      address,
      age,
      gender,
      role,
      company,
      phone,
    } = createUserDto;

    const hashPassword = this.getHashPassword(password);

    //add logic check email
    const isExist = await this.usersRepository.findOne({
      where: { email },
    });

    if (isExist) {
      throw new BadRequestException(
        `Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`,
      );
    }

    const newUser = await this.usersRepository.create({
      email,
      password: hashPassword,
      name,
      age,
      gender,
      phone,
      address,
      role: {
        id: role?.id,
      },
      company: {
        id: company?.id,
      },
      createdBy: {
        id: user.id,
        email: user.email,
      },
    });

    return await this.usersRepository.save(newUser);
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit ? limit : 10;

    // Chuyển đổi filter để áp dụng like cho mỗi trường
    const regexFilter = {};
    Object.keys(filter).forEach((key) => {
      regexFilter[key] = ILike(`%${filter[key]}%`);
    });
    const [result, totalItems] = await this.usersRepository.findAndCount({
      where: regexFilter,
      take: defaultLimit,
      skip: offset,
      order: sort as any, // Ép kiểu dữ liệu
      relations: ['company', 'role'],
    });

    result.forEach((item) => {
      delete item.password;
      return item;
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['company', 'role', 'notifies'],
    });
    const role = {
      id: user?.role?.id,
      name: user?.role?.name,
    };

    delete user?.password;

    if (!user) {
      throw new BadRequestException('not found user');
    } else {
      return { ...user, role };
    }
  }

  async findOneByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: { email: username },
      relations: ['company', 'role', 'notifies'],
    });

    if (user) {
      const existingRole = await this.rolesRepository.findOne({
        where: { id: user?.role?.id },
        relations: ['permissions'],
      });

      const role = {
        id: user?.role?.id,
        name: user?.role?.name,
      };

      const permissions = existingRole?.permissions;

      const company = {
        id: user?.company?.id,
        name: user?.company?.name,
      };
      return { ...user, company, role, permissions };
    }
  }

  async findAllUsers(): Promise<User[]> {
    return await this.usersRepository.find({ relations: ['role'] });
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    const {
      id,
      name,
      email,
      address,
      age,
      gender,
      phone,
      role,
      company,
      avatar,
    } = updateUserDto;
    return await this.usersRepository.update(
      { id },
      {
        email,
        name,
        age,
        gender,
        phone,
        address,
        avatar:
          avatar === this.configService.get<string>('EMPTY_AVATAR')
            ? null
            : avatar,
        role: {
          id: role?.id,
        },
        company: {
          id: company?.id,
        },
        updatedBy: {
          id: user.id,
          email: user.email,
        },
      },
    );
  }

  async updateCVByUser(data: { urlCV: string }, user: IUser) {
    await this.usersRepository.update(
      { id: user.id },
      {
        urlCV: data.urlCV,
        updatedBy: {
          id: user.id,
          email: user.email,
        },
      },
    );
    return { urlCV: data.urlCV };
  }

  async remove(id: number, user: IUser) {
    const userDelete = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (userDelete && userDelete.email === 'admin@gmail.com') {
      throw new BadRequestException('Không thể xóa tài khoản admin@gmail.com');
    }

    if (!userDelete) {
      throw new BadRequestException('not found user');
    } else {
      await this.usersRepository.update(
        { id },
        {
          deletedBy: {
            id: user.id,
            email: user.email,
          },
        },
      );
      return await this.usersRepository.softDelete(id);
    }
  }

  updateUserToken = async (refreshToken: string, id: number) => {
    return await this.usersRepository.update({ id }, { refreshToken });
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.usersRepository.findOne({
      where: { refreshToken },
      relations: ['role'],
    });
  };
}
