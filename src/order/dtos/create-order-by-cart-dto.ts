import { OmitType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order-dto';

export class CreateOrderByCartDto extends OmitType(CreateOrderDto, [
  'products',
]) {}
