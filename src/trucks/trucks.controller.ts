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
import { CurrentUser, type JwtPayload } from '../auth/decorators/current-user.decorator';
import { CreateTruckUseCase } from '../application/create-truck.use-case';
import { ListTrucksUseCase } from '../application/list-trucks.use-case';
import { UpdateTruckUseCase } from '../application/update-truck.use-case';
import { DeleteTruckUseCase } from '../application/delete-truck.use-case';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';

class TruckUserResponseDto {
  @ApiProperty({ example: '64a1f2c3e4b5d6f7a8b9c0d2' })
  _id: string;

  @ApiProperty({ example: 'owner@example.com' })
  email: string;
}

class TruckResponseDto {
  @ApiProperty({ example: '64a1f2c3e4b5d6f7a8b9c0d1' })
  _id: string;

  @ApiProperty({ example: '2021' })
  year: string;

  @ApiProperty({ example: 'Red' })
  color: string;

  @ApiProperty({ example: 'ABC-1234' })
  plates: string;
}

class TruckWithUserResponseDto extends TruckResponseDto {
  @ApiProperty({ type: TruckUserResponseDto })
  user: TruckUserResponseDto;
}

@ApiTags('trucks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trucks')
export class TrucksController {
  constructor(
    private readonly createTruckUseCase: CreateTruckUseCase,
    private readonly listTrucksUseCase: ListTrucksUseCase,
    private readonly updateTruckUseCase: UpdateTruckUseCase,
    private readonly deleteTruckUseCase: DeleteTruckUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a truck for the authenticated user' })
  @ApiCreatedResponse({ type: TruckResponseDto, description: 'Truck created' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async create(
    @Body() dto: CreateTruckDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<TruckResponseDto> {
    return this.createTruckUseCase.execute(user.sub, dto) as unknown as TruckResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'List all trucks with owner info (aggregate)' })
  @ApiOkResponse({ type: [TruckWithUserResponseDto], description: 'List of trucks' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async findAll(): Promise<TruckWithUserResponseDto[]> {
    return this.listTrucksUseCase.execute() as unknown as TruckWithUserResponseDto[];
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a truck (only the owner can update)' })
  @ApiOkResponse({ type: TruckResponseDto, description: 'Truck updated' })
  @ApiNotFoundResponse({ description: 'Truck not found or you do not own it' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTruckDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<TruckResponseDto> {
    return this.updateTruckUseCase.execute(id, user.sub, dto) as unknown as TruckResponseDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a truck (only the owner can delete)' })
  @ApiNoContentResponse({ description: 'Truck deleted' })
  @ApiNotFoundResponse({ description: 'Truck not found or you do not own it' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload): Promise<void> {
    return this.deleteTruckUseCase.execute(id, user.sub);
  }
}
