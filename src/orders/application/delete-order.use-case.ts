import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ORDER_REPOSITORY } from '../../utils/injection-tokens';
import type { OrderRepositoryPort } from '../domain/order.repository.port';

@Injectable()
export class DeleteOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: OrderRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.orderRepo.delete(id);
    if (!deleted) {
      throw new NotFoundException('Order not found');
    }
  }
}
