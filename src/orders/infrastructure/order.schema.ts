import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserSchemaClass } from '../../auth/infrastructure/user.schema';
import { TruckSchemaClass } from '../../trucks/infrastructure/truck.schema';
import { LocationSchemaClass } from '../../locations/infrastructure/location.schema';
import { OrderStatus } from '../domain/order-status.enum';

export type OrderDocument = HydratedDocument<OrderSchemaClass>;

@Schema({ collection: 'orders', timestamps: true })
export class OrderSchemaClass {
  @Prop({ type: Types.ObjectId, ref: UserSchemaClass.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: TruckSchemaClass.name, required: true })
  truck: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.CREATED,
    required: true,
  })
  status: OrderStatus;

  @Prop({ type: Types.ObjectId, ref: LocationSchemaClass.name, required: true })
  pickup: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: LocationSchemaClass.name, required: true })
  dropoff: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(OrderSchemaClass);
