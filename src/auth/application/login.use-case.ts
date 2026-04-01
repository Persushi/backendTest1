import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { USER_REPOSITORY, PASSWORD_HASHER, TOKEN_GENERATOR } from '../../utils/injection-tokens';
import type { UserRepositoryPort } from '../domain/user.repository.port';
import type { PasswordHasherPort } from '../domain/password-hasher.port';
import type { TokenGeneratorPort } from '../domain/token-generator.port';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,

    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,

    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: TokenGeneratorPort,
  ) {}

  async execute(email: string, password: string): Promise<{ access_token: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await this.passwordHasher.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const access_token = this.tokenGenerator.generate({
      sub: user._id,
      email: user.email,
    });

    return { access_token };
  }
}
