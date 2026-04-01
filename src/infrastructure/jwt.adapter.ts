import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenGeneratorPort } from '../domain/token-generator.port';

@Injectable()
export class JwtAdapter implements TokenGeneratorPort {
  constructor(private readonly jwtService: JwtService) {}

  generate(payload: Record<string, unknown>): string {
    return this.jwtService.sign(payload);
  }
}
