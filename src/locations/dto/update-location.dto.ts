import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLocationDto {
  @ApiPropertyOptional({ example: '123 Main St, Springfield', description: 'Updated address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 40.7128, description: 'Updated latitude' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: -74.006, description: 'Updated longitude' })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
