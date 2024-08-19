import { IsImageUrl } from '@/utils/validators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateProductReviewDto {
  @ApiProperty()
  @IsString()
  @Length(3, 50)
  title: string;

  @ApiProperty()
  @IsString()
  @Length(3, 2000)
  description: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  stars: number;

  @ApiPropertyOptional()
  @IsImageUrl({ each: true })
  @IsOptional()
  images?: string[];
}
