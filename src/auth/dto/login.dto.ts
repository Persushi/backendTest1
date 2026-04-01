import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @ApiProperty({ example: 'StrongP@ss1' })
  @IsString()
  password: string;
}
