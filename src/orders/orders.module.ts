import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchemaClass, OrderSchema } from './infrastructure/order.schema';
import { OrderMongooseRepository } from './infrastructure/order.repository';
import { CreateOrderUseCase } from './application/create-order.use-case';
import { ListOrdersUseCase } from './application/list-orders.use-case';
import { UpdateOrderUseCase } from './application/update-order.use-case';
import { DeleteOrderUseCase } from './application/delete-order.use-case';
import { AdvanceToTransitUseCase } from './application/advance-to-transit.use-case';
import { AdvanceToCompletedUseCase } from './application/advance-to-completed.use-case';
import { OrdersController } from './orders.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocationsModule } from '../locations/locations.module';
import { TrucksModule } from '../trucks/trucks.module';
import { ORDER_REPOSITORY } from '../utils/injection-tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OrderSchemaClass.name, schema: OrderSchema }]),
    LocationsModule,
    TrucksModule,
  ],
  controllers: [OrdersController],
  providers: [
    JwtAuthGuard,
    CreateOrderUseCase,
    ListOrdersUseCase,
    UpdateOrderUseCase,
    DeleteOrderUseCase,
    AdvanceToTransitUseCase,
    AdvanceToCompletedUseCase,
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderMongooseRepository,
    },
  ],
})
export class OrdersModule {}
