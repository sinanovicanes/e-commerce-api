import { AddressInfoDto, CardInfoDto } from '@/payment/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class OrderProductDto {
  @ApiProperty({
    description: 'MongoDB ObjectId of the product',
  })
  @IsMongoId()
  product: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(100)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    type: () => [OrderProductDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @Type(() => OrderProductDto)
  products: OrderProductDto[];

  @ApiProperty({ type: () => CardInfoDto })
  @ValidateNested()
  @IsObject()
  @Type(() => CardInfoDto)
  paymentCard: CardInfoDto;

  @ApiProperty({ type: () => AddressInfoDto })
  @ValidateNested()
  @IsObject()
  @Type(() => AddressInfoDto)
  shipmentAddress: AddressInfoDto;

  @ApiProperty({ type: () => AddressInfoDto })
  @ValidateNested()
  @IsObject()
  @Type(() => AddressInfoDto)
  billingAddress: AddressInfoDto;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identityNumber: string;
}
