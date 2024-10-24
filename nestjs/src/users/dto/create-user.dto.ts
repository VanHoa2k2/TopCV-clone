import { Type } from 'class-transformer';
import {
  Allow,
  IsEmail,
  IsNotEmpty,
  // IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Notify } from 'src/notifies/entities/notify.entity';

class Company {
  @IsNotEmpty()
  id: number;
}

class Role {
  @IsNotEmpty()
  id: number;
}

export class CreateUserDto {
  id: number;

  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  @Allow()
  age: number;

  @Allow()
  gender: string;

  @Allow()
  phone: string;

  @Allow()
  address: string;

  @Allow()
  avatar?: string | null;

  @IsNotEmpty({ message: 'Role không được để trống' })
  @IsObject()
  @ValidateNested()
  @Type(() => Role)
  role: Role;

  @Allow()
  @ValidateNested()
  @Type(() => Company)
  company?: Company;

  @Allow()
  @ValidateNested()
  @Type(() => Notify)
  notifies?: Notify[];
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  @Allow()
  age: number;

  @Allow()
  gender: string;

  @Allow()
  phone: string;

  @Allow()
  address: string;

  @IsNotEmpty({ message: 'Role không được để trống' })
  @IsObject()
  @ValidateNested()
  @Type(() => Role)
  role: Role;

  @Allow()
  @ValidateNested()
  @Type(() => Company)
  company?: Company;
}
