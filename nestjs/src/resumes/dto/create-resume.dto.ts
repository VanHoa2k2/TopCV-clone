import { Allow, IsNotEmpty } from 'class-validator';

export class CreateResumeDto {
  @IsNotEmpty({ message: 'email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'userId không được để trống' })
  userId: number;

  @IsNotEmpty({ message: 'url không được để trống' })
  url: string;

  @IsNotEmpty({ message: 'status không được để trống' })
  status: string;

  @Allow()
  token: string;

  @IsNotEmpty({ message: 'companyId không được để trống' })
  companyId: number;

  @IsNotEmpty({ message: 'jobId không được để trống' })
  jobId: number;
}

export class UploadCvDto {
  @IsNotEmpty({ message: 'url không được để trống' })
  url: string;
}

export class CreateUserCvDto {
  @IsNotEmpty({ message: 'url không được để trống' })
  url: string;

  @IsNotEmpty({ message: 'companyId không được để trống' })
  companyId: number;

  @IsNotEmpty({ message: 'jobId không được để trống' })
  jobId: number;
}
