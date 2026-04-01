import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTruckDto {
  @ApiProperty({ example: '2021', description: 'Year of the truck' })
  @IsString()
  @IsNotEmpty({ message: 'year is required' })
  year: string;

  @ApiProperty({ example: 'Red', description: 'Color of the truck' })
  @IsString()
  @IsNotEmpty({ message: 'color is required' })
  color: string;

  @ApiProperty({ example: 'ABC-1234', description: 'License plates of the truck' })
  @IsString()
  @IsNotEmpty({ message: 'plates is required' })
  plates: string;
}
