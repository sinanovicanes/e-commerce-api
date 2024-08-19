import { Merchant } from '@/merchant/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProductStatus } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Product extends Document {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  description: string;

  @ApiProperty()
  @Prop({ required: true })
  price: number;

  @ApiProperty()
  @Prop({ required: true })
  stock: number;

  @ApiProperty()
  @Prop({ required: true })
  image: string;

  @ApiProperty()
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
