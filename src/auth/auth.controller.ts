import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegisterUseCase } from '../application/register.use-case';
import { LoginUseCase } from '../application/login.use-case';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

class TokenResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ type: TokenResponseDto, description: 'User created — returns JWT' })
  @ApiConflictResponse({ description: 'Email already exists' })
  async register(@Body() dto: RegisterDto): Promise<{ access_token: string }> {
    return this.registerUseCase.execute(dto.email, dto.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate an existing user' })
  @ApiOkResponse({ type: TokenResponseDto, description: 'Authentication successful — returns JWT' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto): Promise<{ access_token: string }> {
    return this.loginUseCase.execute(dto.email, dto.password);
  }
}
