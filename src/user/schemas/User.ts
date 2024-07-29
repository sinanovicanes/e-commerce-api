import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { setUpdatedAtPlugin } from '@/utils/setUpdatedAtPlugin';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  name: string;

  @Prop()
  lastname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatar: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = setUpdatedAtPlugin(
  SchemaFactory.createForClass(User),
);

export const UserModelDefinition = {
  name: User.name,
  schema: UserSchema,
};
