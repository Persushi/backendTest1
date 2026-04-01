import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserSchemaClass } from './user.schema';

export type TruckDocument = HydratedDocument<TruckSchemaClass>;

@Schema({ collection: 'trucks', timestamps: true })
export class TruckSchemaClass {
  @Prop({ type: Types.ObjectId, ref: UserSchemaClass.name, required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  year: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  plates: string;
}

export const TruckSchema = SchemaFactory.createForClass(TruckSchemaClass);
