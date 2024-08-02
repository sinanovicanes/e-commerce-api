import { User } from '@/user/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class ResetToken extends Document {
  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true, unique: true, type: Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ required: true, expires: 0 })
  expiresAt: Date;
}

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);

export const ResetTokenDefinition = {
  name: ResetToken.name,
  schema: ResetTokenSchema,
};
