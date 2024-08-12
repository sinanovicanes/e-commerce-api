import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PaymentGateways, PaymentMethods } from '../enums';
import { Order } from '@/order/schemas';
import { Document, Types } from 'mongoose';
import { User } from '@/user/schemas';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ required: true, ref: Order.name, type: Types.ObjectId })
  order: Order | Types.ObjectId;

  @Prop({ required: true, ref: User.name, type: Types.ObjectId })
  user: User | Types.ObjectId;

  @Prop({ required: true, enum: PaymentGateways })
  gateway: PaymentGateways;

  @Prop({ required: true })
  paymentId: string;

  createdAt: Date;
  updatedAt: Date;
}

export const PaymentSchema =
  SchemaFactory.createForClass(Payment).loadClass(Payment);
export const PaymentDefinition = {
  name: Payment.name,
  schema: PaymentSchema,
};
