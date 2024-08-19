import { User } from '@/user/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Merchant extends Document {
  @ApiProperty()
  @Prop({ required: true })
  name: string;
  @ApiProperty()
  @Prop({ required: true })
  address: string;
  @ApiProperty()
  @Prop({ required: true })
  phone: string;
  @ApiProperty()
  @Prop({ required: true, unique: true })
  email: string;
  @ApiPropertyOptional()
  @Prop()
  website?: string;
  @ApiPropertyOptional()
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

export const MerchantSchema =
  SchemaFactory.createForClass(Merchant).loadClass(Merchant);
export const MerchantDefinition = {
  name: Merchant.name,
  schema: MerchantSchema,
};
