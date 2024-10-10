import { Allow, IsArray, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  id: number;

  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @Allow()
  linkWebsite: string | null;

  @IsNotEmpty({ message: 'employee size không được để trống' })
  employeeSize: string;

  @IsNotEmpty({ message: 'address không được để trống' })
  address: string;

  @IsNotEmpty({ message: 'description không được để trống' })
  description: string;

  @IsNotEmpty({ message: 'Logo không được để trống' })
  logo: string;

  @Allow()
  coverImage: string | null;

  @IsNotEmpty({ message: 'Fields không được để trống' })
  @IsArray({ message: 'Fields có định dạng là array' })
  fields: string[];
}
