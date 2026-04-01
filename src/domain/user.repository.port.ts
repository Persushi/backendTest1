import type { User } from './user.entity';

export interface UserRepositoryPort {
  create(email: string, hashedPassword: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
