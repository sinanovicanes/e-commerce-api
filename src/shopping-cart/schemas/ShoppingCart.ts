import { Product } from '@/product/schemas';
import { User } from '@/user/schemas';
import { adjustDate } from '@/utils/date';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

class ShoppingCartProduct {
  @ApiProperty({ type: () => Product })
  product: Product | Types.ObjectId;

  @ApiProperty()
  quantity: number;
}

@Schema({ timestamps: true })
export class ShoppingCart extends Document {
  @ApiProperty({ type: () => User })
  @Prop({ unique: true, required: true, type: Types.ObjectId, ref: 'User' })
  user: User | Types.ObjectId;

  @ApiProperty({ type: () => [ShoppingCartProduct] })
  @Prop([
    { product: { type: Types.ObjectId, ref: 'Product' }, quantity: Number },
  ])
  products: ShoppingCartProduct[];

  @ApiProperty()
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
