import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { apiPath, method } = createPermissionDto;
    const isExist = await this.permissionRepository.findOne({
      where: {
        apiPath,
        method,
      },
    });

    if (isExist) {
      throw new BadRequestException(
        `Permission with apiPath=${apiPath} , method=${method}`,
      );
    }
    const permission = await this.permissionRepository.create({
      ...createPermissionDto,
      createdBy: {
        id: user.id,
        email: user.email,
      },
    });

    await this.permissionRepository.save(permission);

    return {
      id: permission?.id,
      createAt: permission?.createdAt,
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

    const [result, totalItems] = await this.permissionRepository.findAndCount({
      where: regexFilter,
      take: defaultLimit,
      skip: offset,
      order: sort as any, // Ép kiểu dữ liệu
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
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      return `not found permission`;
    } else {
      return permission;
    }
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
    user: IUser,
  ) {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new BadRequestException(`Permission with id ${id} not found.`);
    }

    await this.permissionRepository.delete(permission);
    return await this.permissionRepository.save({
      id,
      ...updatePermissionDto,
      updatedBy: {
        id: user.id,
        email: user.email,
      },
    });
  }

  async remove(id: number, user: IUser) {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new BadRequestException('not found permission');
    } else {
      await this.permissionRepository.update(
        { id },
        {
          deletedBy: {
            id: user.id,
            email: user.email,
          },
        },
      );

      return await this.permissionRepository.softDelete(id);
    }
  }
}
