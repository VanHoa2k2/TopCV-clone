import { IsNotEmpty } from 'class-validator';

export class UpdateNotifyDto {
  @IsNotEmpty({ message: 'Status không được để trống' })
  isActive: boolean;
}
