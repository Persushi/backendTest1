import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TRUCK_REPOSITORY } from '../utils/injection-tokens';
import type { TruckRepositoryPort } from '../domain/truck.repository.port';

@Injectable()
export class DeleteTruckUseCase {
  constructor(
    @Inject(TRUCK_REPOSITORY)
    private readonly truckRepo: TruckRepositoryPort,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const deleted = await this.truckRepo.delete(id, userId);
    if (!deleted) {
      throw new NotFoundException('Truck not found or you do not own it');
    }
  }
}
