import { Product } from '@/product/schemas';
import { User } from '@/user/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderStatus } from '../enums';

interface OrderProduct {
  product: Product | Types.ObjectId;
  quantity: number;
  price: number;
}

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User | Types.ObjectId;

  @Prop([
    { product: { type: Types.ObjectId, ref: Product.name }, quantity: Number },
  ])
  products: OrderProduct[];

  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

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
