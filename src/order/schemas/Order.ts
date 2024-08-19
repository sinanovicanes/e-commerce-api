import { Product } from '@/product/schemas';
import { User } from '@/user/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderStatus } from '../enums';
import { Payment } from '@/payment/schemas';
import { ApiProperty } from '@nestjs/swagger';

class OrderProduct {
  @ApiProperty({ type: () => Product })
  product: Product | Types.ObjectId;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  price: number;
}

@Schema({ timestamps: true })
export class Order extends Document {
  @ApiProperty({ type: () => User })
  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User | Types.ObjectId;

  @ApiProperty({ type: () => [OrderProduct] })
  @Prop([
    {
      product: { type: Types.ObjectId, ref: Product.name },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ])
  products: OrderProduct[];

  @ApiProperty({ enum: OrderStatus, default: OrderStatus.PENDING })
  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ ref: 'Payment', type: Types.ObjectId })
  payment?: Payment | Types.ObjectId;

  get total(): number {
    return this.products.reduce((acc, curr) => acc + curr.price, 0);
  }

  createdAt: Date;
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order).loadClass(Order);
export const OrderDefinition = {
  name: Order.name,
  schema: OrderSchema,
};
