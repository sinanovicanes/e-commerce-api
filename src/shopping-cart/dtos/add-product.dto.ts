import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsMongoId, Max, Min } from 'class-validator';

export class AddProductDto {
  @ApiProperty({ description: 'MongoDB ObjectId of the product' })
  @IsMongoId()
  productId: string;
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(100)
  quantity: number;
}
