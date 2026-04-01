import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LOCATION_REPOSITORY } from '../utils/injection-tokens';
import type { LocationRepositoryPort, UpdateLocationData } from '../domain/location.repository.port';
import type { Location } from '../domain/location.entity';

@Injectable()
export class UpdateLocationUseCase {
  constructor(
    @Inject(LOCATION_REPOSITORY)
    private readonly locationRepo: LocationRepositoryPort,
  ) {}

  async execute(id: string, data: UpdateLocationData): Promise<Location> {
    const updated = await this.locationRepo.update(id, data);
    if (!updated) {
      throw new NotFoundException('Location not found');
    }
    return updated;
  }
}
