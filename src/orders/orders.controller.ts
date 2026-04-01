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
import { CurrentUser, type JwtPayload } from '../auth/decorators/current-user.decorator';
import { CreateOrderUseCase } from './application/create-order.use-case';
import { ListOrdersUseCase } from './application/list-orders.use-case';
import { UpdateOrderUseCase } from './application/update-order.use-case';
import { DeleteOrderUseCase } from './application/delete-order.use-case';
import { AdvanceToTransitUseCase } from './application/advance-to-transit.use-case';
import { AdvanceToCompletedUseCase } from './application/advance-to-completed.use-case';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './domain/order-status.enum';

class OrderUserDto {
  @ApiProperty({ example: '64a1f2c3e4b5d6f7a8b9c0d1' }) _id: string;
  @ApiProperty({ example: 'owner@example.com' }) email: string;
}

class OrderTruckDto {
  @ApiProperty({ example: '64a1f2c3e4b5d6f7a8b9c0d2' }) _id: string;
  @ApiProperty({ example: '2021' }) year: string;
  @ApiProperty({ example: 'Red' }) color: string;
  @ApiProperty({ example: 'ABC-1234' }) plates: string;
}

class OrderLocationDto {
  @ApiProperty({ example: '64a1f2c3e4b5d6f7a8b9c0d3' }) _id: string;
  @ApiProperty({ example: 'ChIJN1t_tDeuEmsRUsoyG83frY4' }) place_id: string;
  @ApiProperty({ example: 'Sydney NSW 2000, Australia' }) address: string;
  @ApiProperty({ example: -33.8688 }) latitude: number;
  @ApiProperty({ example: 151.2093 }) longitude: number;
}

class OrderResponseDto {
  @ApiProperty({ example: '64a1f2c3e4b5d6f7a8b9c0d0' }) _id: string;
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.CREATED }) status: OrderStatus;
}

class OrderWithRefsResponseDto extends OrderResponseDto {
  @ApiProperty({ type: OrderUserDto }) user: OrderUserDto;
  @ApiProperty({ type: OrderTruckDto }) truck: OrderTruckDto;
  @ApiProperty({ type: OrderLocationDto }) pickup: OrderLocationDto;
  @ApiProperty({ type: OrderLocationDto }) dropoff: OrderLocationDto;
}

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly listOrdersUseCase: ListOrdersUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly deleteOrderUseCase: DeleteOrderUseCase,
    private readonly advanceToTransitUseCase: AdvanceToTransitUseCase,
    private readonly advanceToCompletedUseCase: AdvanceToCompletedUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order (status starts as "created")' })
  @ApiCreatedResponse({ type: OrderResponseDto, description: 'Order created' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async create(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<OrderResponseDto> {
    return this.createOrderUseCase.execute({ ...dto, userId: user.sub }) as unknown as OrderResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'List all orders with user, truck, pickup, and dropoff populated' })
  @ApiOkResponse({ type: [OrderWithRefsResponseDto], description: 'List of orders' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async findAll(): Promise<OrderWithRefsResponseDto[]> {
    return this.listOrdersUseCase.execute() as unknown as OrderWithRefsResponseDto[];
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update truck, pickup, or dropoff (only when status is "created")' })
  @ApiOkResponse({ type: OrderResponseDto, description: 'Order updated' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiConflictResponse({ description: 'Order cannot be modified in its current status' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.updateOrderUseCase.execute(id, dto) as unknown as OrderResponseDto;
  }

  @Patch(':id/start')
  @ApiOperation({ summary: 'Advance order from "created" to "in_transit"' })
  @ApiOkResponse({ type: OrderResponseDto, description: 'Status updated to in_transit' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiConflictResponse({ description: 'Order is not in "created" status' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async advanceToTransit(@Param('id') id: string): Promise<OrderResponseDto> {
    return this.advanceToTransitUseCase.execute(id) as unknown as OrderResponseDto;
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Advance order from "in_transit" to "completed"' })
  @ApiOkResponse({ type: OrderResponseDto, description: 'Status updated to completed' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiConflictResponse({ description: 'Order is not in "in_transit" status' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async advanceToCompleted(@Param('id') id: string): Promise<OrderResponseDto> {
    return this.advanceToCompletedUseCase.execute(id) as unknown as OrderResponseDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an order (any status)' })
  @ApiNoContentResponse({ description: 'Order deleted' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.deleteOrderUseCase.execute(id);
  }
}
