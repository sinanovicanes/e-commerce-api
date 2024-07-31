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
  @IsOptional()
  @Min(0)
  @Max(5)
  stars?: number;

  @IsMongoId()
  productId: string;

  @IsMongoId()
  @IsOptional()
  parentId?: string;

  @IsImageUrl({ each: true })
  @IsOptional()
  images?: string[];
}
