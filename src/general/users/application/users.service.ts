import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@user/domain/user.repository';
import { UserM } from '@user/domain/user';
import { CreateUserInput } from '@user/infrastructure/presentation/dto/create-user.input';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  async createUser(user: CreateUserInput): Promise<UserM> {
    const passwordHash = user.password;
    delete user.password;
    return this.userRepo.create({ ...user, isActive: true, passwordHash });
  }

  async getUser(id: number) {
    const existsUser = await this.userRepo.findById(id);
    if (!existsUser) {
      throw new NotFoundException('User Not Found');
    }
    return existsUser;
  }

  async listUsers() {
    return this.userRepo.list();
  }
}
