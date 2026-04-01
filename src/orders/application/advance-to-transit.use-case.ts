import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ORDER_REPOSITORY } from '../../utils/injection-tokens';
import type { OrderRepositoryPort } from '../domain/order.repository.port';
import type { Order } from '../domain/order.entity';
import { OrderStatus } from '../domain/order-status.enum';

@Injectable()
export class AdvanceToTransitUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: OrderRepositoryPort,
  ) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orderRepo.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status !== OrderStatus.CREATED) {
      throw new ConflictException(
        `Cannot advance to "in_transit": current status is "${order.status}"`,
      );
    }

    const updated = await this.orderRepo.updateStatus(id, OrderStatus.IN_TRANSIT);
    return updated!;
  }
}
