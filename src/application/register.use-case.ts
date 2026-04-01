import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, PASSWORD_HASHER, TOKEN_GENERATOR } from '../utils/injection-tokens';
import type { UserRepositoryPort } from '../domain/user.repository.port';
import type { PasswordHasherPort } from '../domain/password-hasher.port';
import type { TokenGeneratorPort } from '../domain/token-generator.port';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,

    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,

    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: TokenGeneratorPort,
  ) {}

  async execute(email: string, password: string): Promise<{ access_token: string }> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.passwordHasher.hash(password);
    const user = await this.userRepo.create(email, hashedPassword);

    const access_token = this.tokenGenerator.generate({
      sub: user._id,
      email: user.email,
    });

    return { access_token };
  }
}
