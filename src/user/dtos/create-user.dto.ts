import { AuthStrategies } from '@/auth/enums';
import { IsImageUrl, IsValidPassword } from '@/utils/validators';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
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

  @IsEnum(AuthStrategies)
  @IsOptional()
  strategy?: AuthStrategies;
}
