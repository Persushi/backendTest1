import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTruckDto {
  @ApiPropertyOptional({ example: '2022', description: 'Updated year' })
  @IsOptional()
  @IsString()
  year?: string;

  @ApiPropertyOptional({ example: 'Blue', description: 'Updated color' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: 'XYZ-5678', description: 'Updated plates' })
  @IsOptional()
  @IsString()
  plates?: string;
}
