import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ORDER_REPOSITORY } from '../../utils/injection-tokens';
import type { OrderRepositoryPort } from '../domain/order.repository.port';
import type { Order } from '../domain/order.entity';
import { OrderStatus } from '../domain/order-status.enum';

@Injectable()
export class AdvanceToCompletedUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: OrderRepositoryPort,
  ) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orderRepo.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status !== OrderStatus.IN_TRANSIT) {
      throw new ConflictException(
        `Cannot advance to "completed": current status is "${order.status}"`,
      );
    }

    const updated = await this.orderRepo.updateStatus(id, OrderStatus.COMPLETED);
    return updated!;
  }
}
