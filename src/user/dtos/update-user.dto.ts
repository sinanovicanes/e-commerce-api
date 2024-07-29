import { IsImageUrl, IsValidPassword } from '@/utils/validators/';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsValidPassword()
  @IsOptional()
  password: string;
  @IsImageUrl()
  @IsOptional()
  avatar: string;
}
