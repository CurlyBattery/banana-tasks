import { ICommand } from '@nestjs/cqrs';

import { CreateUserInput } from '@user/infrastructure/presentation/dto/create-user.input';

export class RegisterUserCommand implements ICommand {
  constructor(public readonly data: CreateUserInput) {}
}
