import { IsInt, IsMongoId, Max, Min } from 'class-validator';

export class AddProductDto {
  @IsMongoId()
  productId: string;
  @IsInt()
  @Min(1)
  @Max(100)
  quantity: number;
}
