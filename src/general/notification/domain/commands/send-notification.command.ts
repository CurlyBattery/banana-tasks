import { ICommand } from '@nestjs/cqrs';

export class SendNotificationCommand implements ICommand {
  constructor(
    public readonly userId: number,
    public readonly title: string,
    public readonly data: string,
  ) {}
}
