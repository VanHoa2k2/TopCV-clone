import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty({ message: 'Content không được để trống' })
  @IsString({ message: 'Content phải là chuỗi' })
  content: string;
}
