import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { LOCATION_REPOSITORY, GOOGLE_PLACES_PORT } from '../../utils/injection-tokens';
import type { LocationRepositoryPort } from '../domain/location.repository.port';
import type { GooglePlacesPort } from '../domain/google-places.port';
import type { Location } from '../domain/location.entity';

@Injectable()
export class CreateLocationUseCase {
  constructor(
    @Inject(LOCATION_REPOSITORY)
    private readonly locationRepo: LocationRepositoryPort,

    @Inject(GOOGLE_PLACES_PORT)
    private readonly googlePlaces: GooglePlacesPort,
  ) {}

  async execute(place_id: string): Promise<Location> {
    const existing = await this.locationRepo.findByPlaceId(place_id);
    if (existing) {
      throw new ConflictException('This place has already been saved');
    }

    const details = await this.googlePlaces.getPlaceDetails(place_id);

    return this.locationRepo.create({
      place_id,
      address: details.address,
      latitude: details.latitude,
      longitude: details.longitude,
    });
  }
}
