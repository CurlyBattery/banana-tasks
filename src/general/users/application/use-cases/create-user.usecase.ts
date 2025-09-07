import { UserRepository } from '@user/domain/user.repository';
import { CreateUserInput } from '@user/infrastructure/presentation/dto/create-user.input';
import { EncryptionService } from '@hashing/application/encryption.service';
import { ConflictException } from '@nestjs/common';

export class CreateUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  async execute(createUserInput: CreateUserInput) {
    const exists = await this.userRepo.findByEmail(createUserInput.email);
    if (exists) {
      throw new ConflictException('User Exists');
    }

    const passwordHash = await this.encryptionService.hashPassword(
      createUserInput.password,
    );
    delete createUserInput.password;
    return this.userRepo.create({
      ...createUserInput,
      isActive: true,
      passwordHash,
    });
  }
}
