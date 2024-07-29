import { IsImageUrl, IsValidPassword } from '@/utils/validators';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsString()
  @Length(3, 32)
  username: string;
  @IsString()
  @Length(3, 255)
  name: string;
  @IsString()
  @Length(3, 255)
  lastname: string;
  @IsEmail()
  email: string;
  @IsValidPassword()
  password: string;
  @IsOptional()
  @IsImageUrl()
  avatar: string;
}
