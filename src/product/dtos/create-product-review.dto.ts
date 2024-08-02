import { IsImageUrl } from '@/utils/validators';
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
  @IsString()
  @Length(3, 50)
  title: string;

  @IsString()
  @Length(3, 2000)
  description: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  stars: number;

  @IsImageUrl({ each: true })
  @IsOptional()
  images?: string[];
}
