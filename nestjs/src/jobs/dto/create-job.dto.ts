import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  IsArray,
  IsString,
  IsDate,
  IsBoolean,
  Allow,
} from 'class-validator';

class Company {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  logo: string;
}

export class CreateJobDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @Allow()
  skills: string[];

  @IsNotEmpty({ message: 'Occupations không được để trống' })
  @IsArray({ message: 'Occupations có định dạng là array' })
  @IsString({ each: true, message: 'Occupations định dạng là string' })
  occupations: string[];

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty({ message: 'Location không được để trống' })
  location: string;

  @IsNotEmpty({ message: 'Salary không được để trống' })
  salary: string;

  @IsNotEmpty({ message: 'Quantity không được để trống' })
  quantity: number;

  @IsNotEmpty({ message: 'employmentType không được để trống' })
  employmentType: string;

  @IsNotEmpty({ message: 'genderReq không được để trống' })
  genderReq: string;

  @IsNotEmpty({ message: 'Level không được để trống' })
  level: string;

  @IsNotEmpty({ message: 'Experience không được để trống' })
  experience: string;

  @IsNotEmpty({ message: 'Description không được để trống' })
  description: string;

  @IsNotEmpty({ message: 'StartDate không được để trống' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'StartDate có định dạng là Date' })
  startDate: Date;

  @IsNotEmpty({ message: 'EndDate không được để trống' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'EndDate có định dạng là Date' })
  endDate: Date;

  @IsNotEmpty({ message: 'IsActive không được để trống' })
  @IsBoolean({ message: 'IsActive có định dạng là boolean' })
  isActive: boolean;
}
