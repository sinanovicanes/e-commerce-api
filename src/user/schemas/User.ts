import { AuthStrategies } from '@/auth/enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
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

  @Prop({ required: true, enum: AuthStrategies, default: AuthStrategies.LOCAL })
  strategy: AuthStrategies;

  @Prop()
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserModelDefinition = {
  name: User.name,
  schema: UserSchema,
};
