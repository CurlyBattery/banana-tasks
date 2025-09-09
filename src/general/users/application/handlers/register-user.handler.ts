import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { RegisterUserCommand } from '@user/domain/commands/register-user.command';
import { UsersService } from '@user/application/users.service';
import { UserM } from '@user/domain/user';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(private readonly usersService: UsersService) {}

  async execute(command: RegisterUserCommand): Promise<UserM> {
    const { data } = command;
    return this.usersService.createUser(data);
  }
}
