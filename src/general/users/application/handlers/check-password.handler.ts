import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckPasswordCommand } from '@user/domain/commands/check-password.command';
import { UsersService } from '@user/application/users.service';

@CommandHandler(CheckPasswordCommand)
export class CheckPasswordHandler
  implements ICommandHandler<CheckPasswordCommand>
{
  constructor(private readonly usersService: UsersService) {}

  execute(command: CheckPasswordCommand): Promise<any> {
    return this.usersService.validatePassword(
      command.user,
      command.rawPassword,
    );
  }
}
