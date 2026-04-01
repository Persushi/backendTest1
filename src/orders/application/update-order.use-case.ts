import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ORDER_REPOSITORY, TRUCK_REPOSITORY, LOCATION_REPOSITORY } from '../../utils/injection-tokens';
import type { OrderRepositoryPort, UpdateOrderData } from '../domain/order.repository.port';
import type { TruckRepositoryPort } from '../../trucks/domain/truck.repository.port';
import type { LocationRepositoryPort } from '../../locations/domain/location.repository.port';
import type { Order } from '../domain/order.entity';
import { OrderStatus } from '../domain/order-status.enum';

@Injectable()
export class UpdateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: OrderRepositoryPort,

    @Inject(TRUCK_REPOSITORY)
    private readonly truckRepo: TruckRepositoryPort,

    @Inject(LOCATION_REPOSITORY)
    private readonly locationRepo: LocationRepositoryPort,
  ) {}

  async execute(id: string, data: UpdateOrderData): Promise<Order> {
    const order = await this.orderRepo.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status !== OrderStatus.CREATED) {
      throw new ConflictException('Only orders with status "created" can be modified');
    }

    if (data.truckId) {
      const truck = await this.truckRepo.findById(data.truckId);
      if (!truck) {
        throw new BadRequestException(`Truck with id "${data.truckId}" does not exist`);
      }
    }

    const pickupId = data.pickupId ?? order.pickupId;
    const dropoffId = data.dropoffId ?? order.dropoffId;

    if (data.pickupId) {
      const pickup = await this.locationRepo.findById(data.pickupId);
      if (!pickup) {
        throw new BadRequestException(`Pickup location with id "${data.pickupId}" does not exist`);
      }
    }
    if (data.dropoffId) {
      const dropoff = await this.locationRepo.findById(data.dropoffId);
      if (!dropoff) {
        throw new BadRequestException(`Dropoff location with id "${data.dropoffId}" does not exist`);
      }
    }
    if (pickupId === dropoffId) {
      throw new BadRequestException('Pickup and dropoff locations must be different');
    }

    const updated = await this.orderRepo.updateFields(id, data);
    return updated!;
  }
}
