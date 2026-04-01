import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({
    example: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    description: 'Google Places place_id',
  })
  @IsString()
  @IsNotEmpty({ message: 'place_id is required' })
  place_id: string;
}
