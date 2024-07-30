import { IsImageUrl } from '@/utils/validators';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(3, 50)
  name: string;
  @IsString()
  @Length(10, 2000)
  description: string;
  @IsNumber()
  @Min(0)
  price: number;
  @IsImageUrl()
  image: string;
  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;
  @IsString()
  @IsNotEmpty()
  category: string;
}
