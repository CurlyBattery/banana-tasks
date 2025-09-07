import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@user/domain/user.repository';
import { UserM } from '@user/domain/user';
import { CreateUserInput } from '@user/infrastructure/presentation/dto/create-user.input';
import { CreateUserUseCase } from '@user/application/use-cases/create-user.usecase';
import { EncryptionService } from '@hashing/application/encryption.service';
import { UpdateUserInput } from '@user/infrastructure/presentation/dto/update-user.input';
import { UpdateUserUseCase } from '@user/application/use-cases/update-user.usecase';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  async createUser(user: CreateUserInput): Promise<UserM> {
    const createUserUseCase = new CreateUserUseCase(
      this.userRepo,
      this.encryptionService,
    );
    return createUserUseCase.execute(user);
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

  async updateUser(id: number, user: UpdateUserInput): Promise<UserM> {
    const updateUserUseCase = new UpdateUserUseCase(this.userRepo);
    return updateUserUseCase.execute(id, user);
  }

  async deleteUser(id: number) {
    const existsUser = await this.userRepo.findById(id);
    if (!existsUser) {
      throw new NotFoundException('User Not Found');
    }
    const deleted = await this.userRepo.delete(id);
    return !!deleted;
  }
}
