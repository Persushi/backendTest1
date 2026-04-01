import { Inject, Injectable } from '@nestjs/common';
import { LOCATION_REPOSITORY } from '../utils/injection-tokens';
import type { LocationRepositoryPort } from '../domain/location.repository.port';
import type { Location } from '../domain/location.entity';

@Injectable()
export class ListLocationsUseCase {
  constructor(
    @Inject(LOCATION_REPOSITORY)
    private readonly locationRepo: LocationRepositoryPort,
  ) {}

  async execute(): Promise<Location[]> {
    return this.locationRepo.findAll();
  }
}
