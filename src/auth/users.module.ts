import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchemaClass, UserSchema } from './infrastructure/user.schema';
import { UserMongooseRepository } from './infrastructure/user.repository';
import { USER_REPOSITORY } from '../utils/injection-tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserSchemaClass.name, schema: UserSchema }]),
  ],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserMongooseRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
