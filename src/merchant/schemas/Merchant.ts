import { User } from '@/user/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Merchant extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  address: string;
  @Prop({ required: true })
  phone: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop()
  website?: string;
  @Prop()
  logo?: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  owner: User | Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name, default: [] }] })
  users: User[] | Types.ObjectId[];

  get ownerId(): Types.ObjectId {
    return this.owner instanceof User
      ? (this.owner._id as Types.ObjectId)
      : this.owner;
  }
}

export const MerchantSchema = SchemaFactory.createForClass(Merchant);
export const MerchantDefinition = {
  name: Merchant.name,
  schema: MerchantSchema,
};
MerchantSchema.loadClass(Merchant);
