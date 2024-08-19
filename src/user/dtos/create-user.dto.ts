import { AuthStrategies } from '@/auth/enums';
import { IsImageUrl, IsValidPassword } from '@/utils/validators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Length(3, 32)
  username: string;
  @ApiProperty()
  @IsString()
  @Length(3, 255)
  name: string;
  @ApiProperty()
  @IsString()
  @Length(3, 255)
  lastname: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsValidPassword()
  password: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsImageUrl()
  avatar: string;

  @ApiProperty({ enum: AuthStrategies, default: AuthStrategies.LOCAL })
  @IsEnum(AuthStrategies)
  @IsOptional()
  strategy?: AuthStrategies;
}
