import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { IUser } from 'src/users/user.interface';
import { Permission } from 'src/permissions/entities/permission.entity';
import aqp from 'api-query-params';
import { ADMIN_ROLE } from 'src/databases/sample';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const isExist = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (isExist) {
      throw new BadRequestException(`Role with name=${createRoleDto.name}`);
    }

    const permissions = createRoleDto.permissions;
    const permissionArr = [];
    const permissionPromises = permissions.map(async (permissionId) => {
      const existingPermission = await this.permissionRepository.findOne({
        where: { id: permissionId },
      });
      existingPermission && permissionArr.push(existingPermission);
    });
    await Promise.all(permissionPromises);

    const role = await this.roleRepository.create({
      ...createRoleDto,
      permissions: permissionArr,
      createdBy: {
        id: user.id,
        email: user.email,
      },
    });

    await this.roleRepository.save(role);

    return {
      id: role?.id,
      createAt: role?.createdAt,
    };
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

    const [result, totalItems] = await this.roleRepository.findAndCount({
      where: regexFilter,
      take: defaultLimit,
      skip: offset,
      order: sort as any, // Ép kiểu dữ liệu
      relations: ['permissions'],
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

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      return `not found role`;
    } else {
      return role;
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto, user: IUser) {
    const permissions = updateRoleDto.permissions;
    const permissionArr = [];
    const permissionPromises = permissions.map(async (permissionId) => {
      const existingPermission = await this.permissionRepository.findOne({
        where: { id: permissionId },
      });
      existingPermission && permissionArr.push(existingPermission);
    });
    await Promise.all(permissionPromises);

    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new BadRequestException(`Role with id ${id} not found.`);
    }

    await this.roleRepository.delete(role);
    return await this.roleRepository.save({
      id,
      ...updateRoleDto,
      permissions: permissionArr,
      updatedBy: {
        id: user.id,
        email: user.email,
      },
    });
  }

  async remove(id: number, user: IUser) {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (role.name === ADMIN_ROLE) {
      throw new BadRequestException('Không thể xóa role ADMIN');
    }

    if (!role) {
      throw new BadRequestException('Not found role');
    } else {
      await this.roleRepository.update(
        { id },
        {
          deletedBy: {
            id: user.id,
            email: user.email,
          },
        },
      );

      return await this.roleRepository.softDelete(id);
    }
  }
}
