import { UserRepository } from '@user/domain/user.repository';
import { ConflictException } from '@nestjs/common';
import { UpdateUserInput } from '@user/infrastructure/presentation/dto/update-user.input';

export class UpdateUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(id: number, updateUserInput: UpdateUserInput) {
    console.log(id);
    const exists = await this.userRepo.findById(id);
    if (!exists) {
      throw new ConflictException('User Not Found');
    }

    return this.userRepo.update(id, updateUserInput);
  }
}
