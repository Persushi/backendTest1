import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LocationSchemaClass, LocationDocument } from './location.schema';
import type {
  LocationRepositoryPort,
  CreateLocationData,
  UpdateLocationData,
} from '../domain/location.repository.port';
import { Location } from '../domain/location.entity';

@Injectable()
export class LocationMongooseRepository implements LocationRepositoryPort {
  constructor(
    @InjectModel(LocationSchemaClass.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}

  async create(data: CreateLocationData): Promise<Location> {
    const doc = await this.locationModel.create(data);
    return this.toDomain(doc);
  }

  async findAll(): Promise<Location[]> {
    const docs = await this.locationModel.find().exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  async findById(id: string): Promise<Location | null> {
    const doc = await this.locationModel.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findByPlaceId(place_id: string): Promise<Location | null> {
    const doc = await this.locationModel.findOne({ place_id }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async update(id: string, data: UpdateLocationData): Promise<Location | null> {
    const doc = await this.locationModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();
    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.locationModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  private toDomain(doc: LocationDocument): Location {
    return new Location(
      doc._id.toString(),
      doc.place_id,
      doc.address,
      doc.latitude,
      doc.longitude,
    );
  }
}
