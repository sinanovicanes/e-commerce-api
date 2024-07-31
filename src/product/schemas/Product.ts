import { Merchant } from '@/merchant/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProductStatus } from '../enums';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  category: string;

  @Prop({
    required: true,
    enum: ProductStatus,
    default: ProductStatus.PUBLISHED,
  })
  status: ProductStatus;

  @Prop({ required: true, ref: Merchant.name, type: Types.ObjectId })
  merchant: Merchant;

  isPublished(): boolean {
    return this.status === ProductStatus.PUBLISHED;
  }
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export const ProductDefinition = {
  name: Product.name,
  schema: ProductSchema,
};

ProductSchema.loadClass(Product);
