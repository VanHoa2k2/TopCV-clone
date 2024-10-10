import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateNotifyDto {
  id: number;

  @IsNotEmpty({ message: 'Status không được để trống' })
  status: string;

  @IsNotEmpty({ message: 'Title không được để trống' })
  title: string;

  @IsNotEmpty({ message: 'Description không được để trống' })
  description: string;

  @IsNotEmpty({ message: 'IsActive không được để trống' })
  isActive: boolean;

  @IsNotEmpty({ message: 'JobId không được để trống' })
  jobId: number;

  @IsNotEmpty({ message: 'NameJob không được để trống' })
  nameJob: string;

  @IsNotEmpty({ message: 'User không được để trống' })
  @Type(() => User)
  user: number;
}
