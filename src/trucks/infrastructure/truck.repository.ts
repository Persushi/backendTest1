import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TruckSchemaClass, TruckDocument } from './truck.schema';
import type {
  TruckRepositoryPort,
  CreateTruckData,
  UpdateTruckData,
} from '../domain/truck.repository.port';
import { Truck, TruckUser, TruckWithUser } from '../domain/truck.entity';

interface TruckAggregateResult {
  _id: Types.ObjectId;
  year: string;
  color: string;
  plates: string;
  user: {
    _id: Types.ObjectId;
    email: string;
  };
}

@Injectable()
export class TruckMongooseRepository implements TruckRepositoryPort {
  constructor(
    @InjectModel(TruckSchemaClass.name)
    private readonly truckModel: Model<TruckDocument>,
  ) {}

  async create(data: CreateTruckData): Promise<Truck> {
    const doc = await this.truckModel.create({
      user: new Types.ObjectId(data.userId),
      year: data.year,
      color: data.color,
      plates: data.plates,
    });
    return this.toDomain(doc);
  }

  async findAllWithUser(): Promise<TruckWithUser[]> {
    const results = await this.truckModel.aggregate<TruckAggregateResult>([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $project: { 'user.password': 0 } },
    ]);

    return results.map((r) => this.toDomainWithUser(r));
  }

  async findById(id: string): Promise<Truck | null> {
    const doc = await this.truckModel.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async update(id: string, userId: string, data: UpdateTruckData): Promise<Truck | null> {
    const doc = await this.truckModel
      .findOneAndUpdate(
        { _id: id, user: new Types.ObjectId(userId) },
        { $set: data },
        { new: true },
      )
      .exec();
    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.truckModel
      .findOneAndDelete({ _id: id, user: new Types.ObjectId(userId) })
      .exec();
    return result !== null;
  }

  private toDomain(doc: TruckDocument): Truck {
    return new Truck(
      doc._id.toString(),
      doc.user.toString(),
      doc.year,
      doc.color,
      doc.plates,
    );
  }

  private toDomainWithUser(raw: TruckAggregateResult): TruckWithUser {
    return new TruckWithUser(
      raw._id.toString(),
      new TruckUser(raw.user._id.toString(), raw.user.email),
      raw.year,
      raw.color,
      raw.plates,
    );
  }
}
