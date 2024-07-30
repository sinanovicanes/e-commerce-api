import { IsImageUrl } from '@/utils/validators';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateMerchantDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsString()
  address: string;

  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  email: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsImageUrl()
  @IsOptional()
  logo?: string;
}
