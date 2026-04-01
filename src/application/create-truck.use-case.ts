import { Inject, Injectable } from '@nestjs/common';
import { TRUCK_REPOSITORY } from '../utils/injection-tokens';
import type { TruckRepositoryPort, CreateTruckData } from '../domain/truck.repository.port';
import type { Truck } from '../domain/truck.entity';

@Injectable()
export class CreateTruckUseCase {
  constructor(
    @Inject(TRUCK_REPOSITORY)
    private readonly truckRepo: TruckRepositoryPort,
  ) {}

  async execute(userId: string, data: Omit<CreateTruckData, 'userId'>): Promise<Truck> {
    return this.truckRepo.create({ ...data, userId });
  }
}
