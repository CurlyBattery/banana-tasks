import { UserM } from '@user/domain/user';

export abstract class UserRepository {
  abstract create(user: UserM): Promise<UserM>;
  abstract findById(id: number): Promise<UserM>;
  abstract findByEmail(email: string): Promise<UserM>;
  abstract update(id: number, user: Partial<UserM>): Promise<UserM>;
  abstract delete(id: number): Promise<UserM>;
  abstract list(): Promise<UserM[]>;
}
