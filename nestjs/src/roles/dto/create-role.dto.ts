import { IsNotEmpty, IsBoolean, IsArray } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'description không được để trống' })
  description: string;

  @IsNotEmpty({ message: 'isActive không được để trống' })
  @IsBoolean({ message: 'IsActive có định dạng là boolean' })
  isActive: boolean;

  @IsNotEmpty({ message: 'permissions không được để trống' })
  @IsArray({ message: 'permissions có định dạng là array' })
  permissions: number[];
}
