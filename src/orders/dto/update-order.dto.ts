import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @ApiPropertyOptional({ example: '64a1f2c3e4b5d6f7a8b9c0d1', description: 'New truck ObjectId' })
  @IsOptional()
  @IsMongoId({ message: 'truckId must be a valid MongoDB ObjectId' })
  truckId?: string;

  @ApiPropertyOptional({ example: '64a1f2c3e4b5d6f7a8b9c0d2', description: 'New pickup location ObjectId' })
  @IsOptional()
  @IsMongoId({ message: 'pickupId must be a valid MongoDB ObjectId' })
  pickupId?: string;

  @ApiPropertyOptional({ example: '64a1f2c3e4b5d6f7a8b9c0d3', description: 'New dropoff location ObjectId' })
  @IsOptional()
  @IsMongoId({ message: 'dropoffId must be a valid MongoDB ObjectId' })
  dropoffId?: string;
}
