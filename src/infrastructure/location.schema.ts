import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LocationDocument = HydratedDocument<LocationSchemaClass>;

@Schema({ collection: 'locations', timestamps: true })
export class LocationSchemaClass {
  @Prop({ required: true, unique: true })
  place_id: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;
}

export const LocationSchema = SchemaFactory.createForClass(LocationSchemaClass);
