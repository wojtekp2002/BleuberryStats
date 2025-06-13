import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ 
    required: true, 
    enum: ['EMPLOYEE', 'EMPLOYER'], 
    default: 'EMPLOYEE' 
  })
  role: 'EMPLOYEE' | 'EMPLOYER';

  @Prop({ 
    type: Types.ObjectId, 
    ref: User.name, 
    default: null 
  })
  employer?: Types.ObjectId | null;

  @Prop({ type: Number, default: 1.0 })
  ratePerKg: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
