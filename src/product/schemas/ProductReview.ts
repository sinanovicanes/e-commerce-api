import { User } from '@/user/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from './Product';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class ProductReview extends Document {
  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  description: string;

  @ApiProperty({ type: [String] })
  @Prop({ default: [] })
  images: string[];

  @ApiProperty()
  @Prop()
  stars: number;

  @ApiProperty({ type: () => Product })
  @Prop({ required: true, ref: Product.name, type: Types.ObjectId })
  product: Product;

  @ApiProperty({ type: () => User })
  @Prop({ required: true, ref: User.name, type: Types.ObjectId })
  user: User;
}

export const ProductReviewSchema =
  SchemaFactory.createForClass(ProductReview).loadClass(ProductReview);
export const ProductReviewDefinition = {
  name: ProductReview.name,
  schema: ProductReviewSchema,
};
