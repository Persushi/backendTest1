import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ORDER_REPOSITORY, TRUCK_REPOSITORY, LOCATION_REPOSITORY } from '../../utils/injection-tokens';
import type { OrderRepositoryPort, CreateOrderData } from '../domain/order.repository.port';
import type { TruckRepositoryPort } from '../../trucks/domain/truck.repository.port';
import type { LocationRepositoryPort } from '../../locations/domain/location.repository.port';
import type { Order } from '../domain/order.entity';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: OrderRepositoryPort,

    @Inject(TRUCK_REPOSITORY)
    private readonly truckRepo: TruckRepositoryPort,

    @Inject(LOCATION_REPOSITORY)
    private readonly locationRepo: LocationRepositoryPort,
  ) {}

  async execute(data: CreateOrderData): Promise<Order> {
    const [truck, pickup, dropoff] = await Promise.all([
      this.truckRepo.findById(data.truckId),
      this.locationRepo.findById(data.pickupId),
      this.locationRepo.findById(data.dropoffId),
    ]);

    if (!truck) {
      throw new BadRequestException(`Truck with id "${data.truckId}" does not exist`);
    }
    if (!pickup) {
      throw new BadRequestException(`Pickup location with id "${data.pickupId}" does not exist`);
    }
    if (!dropoff) {
      throw new BadRequestException(`Dropoff location with id "${data.dropoffId}" does not exist`);
    }
    if (data.pickupId === data.dropoffId) {
      throw new BadRequestException('Pickup and dropoff locations must be different');
    }

    return this.orderRepo.create(data);
  }
}
