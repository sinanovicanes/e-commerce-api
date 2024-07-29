import { IsImageUrl, IsValidPassword } from '@/utils/validators';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class SignInDto {
  @IsString()
  @Length(3, 32)
  @IsOptional()
  username: string;
  @IsEmail()
  @IsOptional()
  email: string;
  @IsValidPassword()
  password: string;
}
