import { Product } from '@/product/schemas';
import { User } from '@/user/schemas';
import { adjustDate } from '@/utils/date';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ShoppingCart extends Document {
  @Prop({ unique: true, required: true, type: Types.ObjectId, ref: 'User' })
  user: User | Types.ObjectId;

  @Prop([
    { product: { type: Types.ObjectId, ref: 'Product' }, quantity: Number },
  ])
  products: { product: Product | Types.ObjectId; quantity: number }[];

  @Prop({ default: adjustDate({ weeks: 2 }), expires: 0 })
  expiresAt: Date;

  async populateProducts() {
    await this.populate({
      path: 'products.product',
      select: 'name description price stock image',
      populate: {
        path: 'merchant',
        select: 'name logo',
      },
    });
  }

  async getTotalPrice(): Promise<number> {
    if (!this.populated('products.product')) {
      await this.populateProducts();
    }

    return this.products.reduce(
      (total, item: { product: Product; quantity: number }) => {
        if (!item.product) {
          return 0;
        }

        return total + item.product.price * item.quantity;
      },
      0,
    );
  }
}

export const ShoppingCartSchema =
  SchemaFactory.createForClass(ShoppingCart).loadClass(ShoppingCart);
export const ShoppingCartDefinition = {
  name: ShoppingCart.name,
  schema: ShoppingCartSchema,
};
