import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from './Product';
import { User } from '@/user/schemas';
import { Merchant } from '@/merchant/schemas';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class ProductQuestion extends Document {
  @ApiProperty()
  @Prop({ required: true })
  question: string;

  @ApiPropertyOptional()
  @Prop()
  answer?: string;

  @ApiPropertyOptional()
  @Prop()
  answeredAt?: Date;

  @ApiPropertyOptional({ type: () => Merchant })
  @Prop({ ref: Merchant.name, type: Types.ObjectId })
  answeredBy?: Merchant | Types.ObjectId;

  @ApiProperty({ type: () => Product })
  @Prop({ required: true, ref: Product.name, type: Types.ObjectId })
  product: Product | Types.ObjectId;

  @ApiProperty({ type: () => User })
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
