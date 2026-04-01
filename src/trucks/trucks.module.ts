import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TruckSchemaClass, TruckSchema } from '../infrastructure/truck.schema';
import { TruckMongooseRepository } from '../infrastructure/truck.repository';
import { CreateTruckUseCase } from '../application/create-truck.use-case';
import { ListTrucksUseCase } from '../application/list-trucks.use-case';
import { UpdateTruckUseCase } from '../application/update-truck.use-case';
import { DeleteTruckUseCase } from '../application/delete-truck.use-case';
import { TrucksController } from './trucks.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TRUCK_REPOSITORY } from '../utils/injection-tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TruckSchemaClass.name, schema: TruckSchema }]),
  ],
  controllers: [TrucksController],
  providers: [
    JwtAuthGuard,
    CreateTruckUseCase,
    ListTrucksUseCase,
    UpdateTruckUseCase,
    DeleteTruckUseCase,
    {
      provide: TRUCK_REPOSITORY,
      useClass: TruckMongooseRepository,
    },
  ],
})
export class TrucksModule {}
