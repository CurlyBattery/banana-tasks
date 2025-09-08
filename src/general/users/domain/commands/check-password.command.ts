import { UserM } from '@user/domain/user';
import { ICommand } from '@nestjs/cqrs';

export class CheckPasswordCommand implements ICommand {
  constructor(
    public readonly user: UserM,
    public readonly rawPassword: string,
  ) {}
}
