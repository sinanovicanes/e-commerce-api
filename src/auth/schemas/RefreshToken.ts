import { User } from '@/user/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class RefreshToken extends Document {
  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true, unique: true, type: Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ required: true, expires: 0 })
  expiresAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

export const RefreshTokenDefinition = {
  name: RefreshToken.name,
  schema: RefreshTokenSchema,
};
