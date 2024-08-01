import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from './Product';
import { User } from '@/user/schemas';
import { Merchant } from '@/merchant/schemas';

@Schema({ timestamps: true })
export class ProductQuestion extends Document {
  @Prop({ required: true })
  question: string;

  @Prop()
  answer?: string;

  @Prop()
  answeredAt?: Date;

  @Prop({ ref: Merchant.name, type: Types.ObjectId })
  answeredBy?: Merchant | Types.ObjectId;

  @Prop({ required: true, ref: Product.name, type: Types.ObjectId })
  product: Product | Types.ObjectId;

  @Prop({ required: true, ref: User.name, type: Types.ObjectId })
  user: User | Types.ObjectId;
}

export const ProductQuestionSchema =
  SchemaFactory.createForClass(ProductQuestion);
export const ProductQuestionDefinition = {
  name: ProductQuestion.name,
  schema: ProductQuestionSchema,
};

ProductQuestionSchema.loadClass(ProductQuestion);
