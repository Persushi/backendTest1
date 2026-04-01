import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateLocationUseCase } from '../application/create-location.use-case';
import { ListLocationsUseCase } from '../application/list-locations.use-case';
import { UpdateLocationUseCase } from '../application/update-location.use-case';
import { DeleteLocationUseCase } from '../application/delete-location.use-case';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

class LocationResponseDto {
  @ApiProperty({ example: '64a1f2c3e4b5d6f7a8b9c0d1' })
  _id: string;

  @ApiProperty({ example: 'ChIJN1t_tDeuEmsRUsoyG83frY4' })
  place_id: string;

  @ApiProperty({ example: 'Sydney NSW 2000, Australia' })
  address: string;

  @ApiProperty({ example: -33.8688 })
  latitude: number;

  @ApiProperty({ example: 151.2093 })
  longitude: number;
}

@ApiTags('locations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('locations')
export class LocationsController {
  constructor(
    private readonly createLocationUseCase: CreateLocationUseCase,
    private readonly listLocationsUseCase: ListLocationsUseCase,
    private readonly updateLocationUseCase: UpdateLocationUseCase,
    private readonly deleteLocationUseCase: DeleteLocationUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a location from a Google Places place_id' })
  @ApiCreatedResponse({ type: LocationResponseDto, description: 'Location created' })
  @ApiConflictResponse({ description: 'This place has already been saved' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async create(@Body() dto: CreateLocationDto): Promise<LocationResponseDto> {
    return this.createLocationUseCase.execute(dto.place_id) as unknown as LocationResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'List all locations' })
  @ApiOkResponse({ type: [LocationResponseDto], description: 'List of locations' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async findAll(): Promise<LocationResponseDto[]> {
    return this.listLocationsUseCase.execute() as unknown as LocationResponseDto[];
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a location by id' })
  @ApiOkResponse({ type: LocationResponseDto, description: 'Location updated' })
  @ApiNotFoundResponse({ description: 'Location not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateLocationDto,
  ): Promise<LocationResponseDto> {
    return this.updateLocationUseCase.execute(id, dto) as unknown as LocationResponseDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a location by id' })
  @ApiNoContentResponse({ description: 'Location deleted' })
  @ApiNotFoundResponse({ description: 'Location not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.deleteLocationUseCase.execute(id);
  }
}
