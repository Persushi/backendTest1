import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TRUCK_REPOSITORY } from '../utils/injection-tokens';
import type { TruckRepositoryPort, UpdateTruckData } from '../domain/truck.repository.port';
import type { Truck } from '../domain/truck.entity';

@Injectable()
export class UpdateTruckUseCase {
  constructor(
    @Inject(TRUCK_REPOSITORY)
    private readonly truckRepo: TruckRepositoryPort,
  ) {}

  async execute(id: string, userId: string, data: UpdateTruckData): Promise<Truck> {
    const updated = await this.truckRepo.update(id, userId, data);
    if (!updated) {
      throw new NotFoundException('Truck not found or you do not own it');
    }
    return updated;
  }
}
