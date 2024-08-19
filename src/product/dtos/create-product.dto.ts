import { IsImageUrl } from '@/utils/validators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @Length(3, 50)
  name: string;
  @ApiProperty()
  @IsString()
  @Length(10, 2000)
  description: string;
  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;
  @ApiProperty()
  @IsImageUrl()
  image: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;
}
