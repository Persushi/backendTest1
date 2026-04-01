import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LOCATION_REPOSITORY } from '../../utils/injection-tokens';
import type { LocationRepositoryPort } from '../domain/location.repository.port';

@Injectable()
export class DeleteLocationUseCase {
  constructor(
    @Inject(LOCATION_REPOSITORY)
    private readonly locationRepo: LocationRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.locationRepo.delete(id);
    if (!deleted) {
      throw new NotFoundException('Location not found');
    }
  }
}
