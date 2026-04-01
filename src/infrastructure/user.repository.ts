import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSchemaClass, UserDocument } from './user.schema';
import { UserRepositoryPort } from '../domain/user.repository.port';
import { User } from '../domain/user.entity';

@Injectable()
export class UserMongooseRepository implements UserRepositoryPort {
  constructor(
    @InjectModel(UserSchemaClass.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(email: string, hashedPassword: string): Promise<User> {
    const doc = await this.userModel.create({ email, password: hashedPassword });
    return this.toDomain(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
    if (!doc) return null;
    return this.toDomain(doc);
  }

  private toDomain(doc: UserDocument): User {
    return new User(doc._id.toString(), doc.email, doc.password);
  }
}
