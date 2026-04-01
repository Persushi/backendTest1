import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { RegisterUseCase } from '../application/register.use-case';
import { LoginUseCase } from '../application/login.use-case';
import { BcryptAdapter } from '../infrastructure/bcrypt.adapter';
import { JwtAdapter } from '../infrastructure/jwt.adapter';
import { PASSWORD_HASHER, TOKEN_GENERATOR } from '../utils/injection-tokens';
import { JWT_EXPIRY } from '../utils/constants';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'CHANGE_ME_IN_PRODUCTION',
      signOptions: { expiresIn: JWT_EXPIRY },
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptAdapter,
    },
    {
      provide: TOKEN_GENERATOR,
      useClass: JwtAdapter,
    },
  ],
})
export class AuthModule {}
