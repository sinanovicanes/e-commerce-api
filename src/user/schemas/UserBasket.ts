import { Product } from '@/product/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './User';
import { adjustDate } from '@/utils/date';

@Schema({ timestamps: true })
export class UserBasket extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ default: [], type: Types.ObjectId, ref: Product.name })
  products: Product[];

  @Prop({ required: true, expires: 0, default: () => adjustDate({ days: 3 }) })
  expiresAt: Date;
}

export const UserBasketSchema = SchemaFactory.createForClass(UserBasket);
export const UserBasketDefinition = {
  name: UserBasket.name,
  schema: UserBasketSchema,
};
