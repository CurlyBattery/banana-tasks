import { Injectable } from '@nestjs/common';
import { UserM } from '@user/domain/user';
import { UserRepository } from '@user/domain/user.repository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  create(user: UserM): Promise<UserM> {
    throw new Error('Method not implemented.');
  }
  findById(id: number): Promise<UserM> {
    throw new Error('Method not implemented.');
  }
  findByEmail(email: string): Promise<UserM> {
    throw new Error('Method not implemented.');
  }
  update(user: Partial<UserM>): Promise<UserM> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  list(): Promise<UserM[]> {
    throw new Error('Method not implemented.');
  }
}
