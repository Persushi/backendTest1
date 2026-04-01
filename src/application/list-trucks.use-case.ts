import { Inject, Injectable } from '@nestjs/common';
import { TRUCK_REPOSITORY } from '../utils/injection-tokens';
import type { TruckRepositoryPort } from '../domain/truck.repository.port';
import type { TruckWithUser } from '../domain/truck.entity';

@Injectable()
export class ListTrucksUseCase {
  constructor(
    @Inject(TRUCK_REPOSITORY)
    private readonly truckRepo: TruckRepositoryPort,
  ) {}

  async execute(): Promise<TruckWithUser[]> {
    return this.truckRepo.findAllWithUser();
  }
}
