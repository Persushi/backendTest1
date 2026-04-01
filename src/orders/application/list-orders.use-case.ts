import { Inject, Injectable } from '@nestjs/common';
import { ORDER_REPOSITORY } from '../../utils/injection-tokens';
import type { OrderRepositoryPort } from '../domain/order.repository.port';
import type { OrderWithRefs } from '../domain/order.entity';

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: OrderRepositoryPort,
  ) {}

  async execute(): Promise<OrderWithRefs[]> {
    return this.orderRepo.findAllWithRefs();
  }
}
