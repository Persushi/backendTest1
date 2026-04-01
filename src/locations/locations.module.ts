import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationSchemaClass, LocationSchema } from '../infrastructure/location.schema';
import { LocationMongooseRepository } from '../infrastructure/location.repository';
import { GooglePlacesAdapter } from '../infrastructure/google-places.adapter';
import { CreateLocationUseCase } from '../application/create-location.use-case';
import { ListLocationsUseCase } from '../application/list-locations.use-case';
import { UpdateLocationUseCase } from '../application/update-location.use-case';
import { DeleteLocationUseCase } from '../application/delete-location.use-case';
import { LocationsController } from './locations.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LOCATION_REPOSITORY, GOOGLE_PLACES_PORT } from '../utils/injection-tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LocationSchemaClass.name, schema: LocationSchema }]),
  ],
  controllers: [LocationsController],
  providers: [
    JwtAuthGuard,
    CreateLocationUseCase,
    ListLocationsUseCase,
    UpdateLocationUseCase,
    DeleteLocationUseCase,
    {
      provide: LOCATION_REPOSITORY,
      useClass: LocationMongooseRepository,
    },
    {
      provide: GOOGLE_PLACES_PORT,
      useClass: GooglePlacesAdapter,
    },
  ],
})
export class LocationsModule {}
