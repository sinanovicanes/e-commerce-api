import { AuthStrategies } from '@/auth/enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  lastname: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: AuthStrategies, default: AuthStrategies.LOCAL })
  strategy: AuthStrategies;

  @ApiProperty()
  @Prop()
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User).loadClass(User);
export const UserModelDefinition = {
  name: User.name,
  schema: UserSchema,
};
