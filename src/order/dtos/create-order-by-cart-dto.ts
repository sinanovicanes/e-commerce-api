import { OmitType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order-dto';

export class CreateOrderByCartDto extends OmitType(CreateOrderDto, [
  'products',
]) {}
