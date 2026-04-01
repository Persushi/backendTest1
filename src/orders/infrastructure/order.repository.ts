import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrderSchemaClass, OrderDocument } from './order.schema';
import type {
  OrderRepositoryPort,
  CreateOrderData,
  UpdateOrderData,
} from '../domain/order.repository.port';
import {
  Order,
  OrderUser,
  OrderTruck,
  OrderLocation,
  OrderWithRefs,
} from '../domain/order.entity';
import { OrderStatus } from '../domain/order-status.enum';

interface OrderAggregateResult {
  _id: Types.ObjectId;
  status: OrderStatus;
  user: { _id: Types.ObjectId; email: string };
  truck: { _id: Types.ObjectId; year: string; color: string; plates: string };
  pickup: { _id: Types.ObjectId; place_id: string; address: string; latitude: number; longitude: number };
  dropoff: { _id: Types.ObjectId; place_id: string; address: string; latitude: number; longitude: number };
}

@Injectable()
export class OrderMongooseRepository implements OrderRepositoryPort {
  constructor(
    @InjectModel(OrderSchemaClass.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(data: CreateOrderData): Promise<Order> {
    const doc = await this.orderModel.create({
      user: new Types.ObjectId(data.userId),
      truck: new Types.ObjectId(data.truckId),
      pickup: new Types.ObjectId(data.pickupId),
      dropoff: new Types.ObjectId(data.dropoffId),
    });
    return this.toDomain(doc);
  }

  async findAllWithRefs(): Promise<OrderWithRefs[]> {
    const results = await this.orderModel.aggregate<OrderAggregateResult>([
      {
        $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' },
      },
      { $unwind: '$user' },
      {
        $lookup: { from: 'trucks', localField: 'truck', foreignField: '_id', as: 'truck' },
      },
      { $unwind: '$truck' },
      {
        $lookup: { from: 'locations', localField: 'pickup', foreignField: '_id', as: 'pickup' },
      },
      { $unwind: '$pickup' },
      {
        $lookup: { from: 'locations', localField: 'dropoff', foreignField: '_id', as: 'dropoff' },
      },
      { $unwind: '$dropoff' },
      { $project: { 'user.password': 0 } },
    ]);

    return results.map((r) => this.toDomainWithRefs(r));
  }

  async findById(id: string): Promise<Order | null> {
    const doc = await this.orderModel.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async updateFields(id: string, data: UpdateOrderData): Promise<Order | null> {
    const set: Record<string, Types.ObjectId> = {};
    if (data.truckId) set['truck'] = new Types.ObjectId(data.truckId);
    if (data.pickupId) set['pickup'] = new Types.ObjectId(data.pickupId);
    if (data.dropoffId) set['dropoff'] = new Types.ObjectId(data.dropoffId);

    const doc = await this.orderModel
      .findByIdAndUpdate(id, { $set: set }, { new: true })
      .exec();
    return doc ? this.toDomain(doc) : null;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const doc = await this.orderModel
      .findByIdAndUpdate(id, { $set: { status } }, { new: true })
      .exec();
    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.orderModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  private toDomain(doc: OrderDocument): Order {
    return new Order(
      doc._id.toString(),
      doc.user.toString(),
      doc.truck.toString(),
      doc.status,
      doc.pickup.toString(),
      doc.dropoff.toString(),
    );
  }

  private toDomainWithRefs(raw: OrderAggregateResult): OrderWithRefs {
    return new OrderWithRefs(
      raw._id.toString(),
      new OrderUser(raw.user._id.toString(), raw.user.email),
      new OrderTruck(raw.truck._id.toString(), raw.truck.year, raw.truck.color, raw.truck.plates),
      raw.status,
      new OrderLocation(raw.pickup._id.toString(), raw.pickup.place_id, raw.pickup.address, raw.pickup.latitude, raw.pickup.longitude),
      new OrderLocation(raw.dropoff._id.toString(), raw.dropoff.place_id, raw.dropoff.address, raw.dropoff.latitude, raw.dropoff.longitude),
    );
  }
}
