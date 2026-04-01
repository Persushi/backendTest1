import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: '64a1f2c3e4b5d6f7a8b9c0d1', description: 'Truck ObjectId' })
  @IsMongoId({ message: 'truckId must be a valid MongoDB ObjectId' })
  @IsNotEmpty()
  truckId: string;

  @ApiProperty({ example: '64a1f2c3e4b5d6f7a8b9c0d2', description: 'Pickup location ObjectId' })
  @IsMongoId({ message: 'pickupId must be a valid MongoDB ObjectId' })
  @IsNotEmpty()
  pickupId: string;

  @ApiProperty({ example: '64a1f2c3e4b5d6f7a8b9c0d3', description: 'Dropoff location ObjectId' })
  @IsMongoId({ message: 'dropoffId must be a valid MongoDB ObjectId' })
  @IsNotEmpty()
  dropoffId: string;
}
