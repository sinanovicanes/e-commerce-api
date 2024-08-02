import { User } from '@/user/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from './Product';

@Schema({ timestamps: true })
export class ProductReview extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: [] })
  images: string[];

  @Prop()
  stars: number;

  @Prop({ required: true, ref: Product.name, type: Types.ObjectId })
  product: Product;

  @Prop({ required: true, ref: User.name, type: Types.ObjectId })
  user: User;
}

export const ProductReviewSchema = SchemaFactory.createForClass(ProductReview);
export const ProductReviewDefinition = {
  name: ProductReview.name,
  schema: ProductReviewSchema,
};

ProductReviewSchema.loadClass(ProductReview);
