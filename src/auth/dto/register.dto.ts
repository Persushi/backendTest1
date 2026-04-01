import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX } from '../../utils/constants';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Valid email address' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @ApiProperty({
    example: 'StrongP@ss1',
    description:
      'Min 8 characters, must include uppercase, lowercase, digit, and special character',
  })
  @IsString()
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
  })
  password: string;
}
