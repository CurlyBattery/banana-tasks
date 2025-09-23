import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '@user/domain/user.repository';
import { UserM } from '@user/domain/user';
import { CreateUserInput } from '@user/infrastructure/presentation/dto/create-user.input';
import { EncryptionService } from '@hashing/application/encryption.service';
import { UpdateUserInput } from '@user/infrastructure/presentation/dto/update-user.input';
import { UserFilterQuery } from '@user/infrastructure/presentation/dto/user-filter.query';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  async createUser(createUserInput: CreateUserInput): Promise<UserM> {
    const exists = await this.userRepo.findByEmail(createUserInput.email);
    if (exists) {
      throw new ConflictException('User Exists');
    }

    const passwordHash = await this.encryptionService.hashPassword(
      createUserInput.password,
    );
    return this.userRepo.create({
      email: createUserInput.email,
      departmentId: createUserInput.departmentId,
      fullName: createUserInput.fullName,
      passwordHash,
      role: createUserInput.role,
    });
  }

  async getUser(id: number, authUserId: number) {
    if (id !== authUserId) {
      throw new ForbiddenException();
    }
    const existsUser = await this.userRepo.findById(id);
    if (!existsUser) {
      throw new NotFoundException('User Not Found');
    }
    return existsUser;
  }

  async listUsers(query?: UserFilterQuery) {
    const users = await this.userRepo.list(query);
    console.log(users);
    return users;
  }

  async updateUser(
    id: number,
    updateUserInput: UpdateUserInput,
  ): Promise<UserM> {
    const exists = await this.userRepo.findById(id);
    if (!exists) {
      throw new ConflictException('User Not Found');
    }
    return this.userRepo.update(id, updateUserInput);
  }

  async deleteUser(id: number, authUserId: number) {
    if (id === authUserId) {
      throw new BadRequestException('You Can Not Delete Yourself');
    }
    const existsUser = await this.userRepo.findById(id);
    if (!existsUser) {
      throw new NotFoundException('User Not Found');
    }
    const deleted = await this.userRepo.delete(id);
    return !!deleted;
  }

  async validatePassword(user: UserM, password: string) {
    return this.encryptionService.verifyPassword(password, user.passwordHash);
  }
}
