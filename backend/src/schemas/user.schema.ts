import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'EMPLOYEE' })
  role: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  employer: User;

  @Prop({ default: 1.0 })
  ratePerKg: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
