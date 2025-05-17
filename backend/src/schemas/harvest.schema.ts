import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

@Schema()
export class Harvest extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  employee: User;

  @Prop({ default: Date.now })
  date: Date;

  @Prop({ required: true })
  kg: number;

  @Prop({ default: 0 })
  amount: number;

  @Prop({ default: false })
  paidOut: boolean;

  @Prop({ default: null })
  payoutDate?: Date;  // Data wypłaty, jeżeli paidOut=true
}

export const HarvestSchema = SchemaFactory.createForClass(Harvest);