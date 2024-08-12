import { AddressInfoDto, CardInfoDto } from '@/payment/dtos';
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
  @IsMongoId()
  product: string;
  @IsInt()
  @Min(1)
  @Max(100)
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @Type(() => OrderProductDto)
  products: OrderProductDto[];

  @ValidateNested()
  @IsObject()
  @Type(() => CardInfoDto)
  paymentCard: CardInfoDto;

  @ValidateNested()
  @IsObject()
  @Type(() => AddressInfoDto)
  shipmentAddress: AddressInfoDto;

  @ValidateNested()
  @IsObject()
  @Type(() => AddressInfoDto)
  billingAddress: AddressInfoDto;

  @IsString()
  @IsNotEmpty()
  identityNumber: string;
}
