import { Type } from 'class-transformer';
import { Allow, IsNotEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateNotifyDto {
  id: number;

  @IsNotEmpty({ message: 'Status không được để trống' })
  status: string;

  @IsNotEmpty({ message: 'Title không được để trống' })
  title: string;

  @IsNotEmpty({ message: 'Description không được để trống' })
  description: string;

  @Allow()
  isActive: boolean;

  @Allow()
  jobId: number;

  @Allow()
  nameJob: string;

  @IsNotEmpty({ message: 'User không được để trống' })
  @Type(() => User)
  user: number;
}
