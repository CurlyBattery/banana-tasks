import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendNotificationCommand } from '@notification/domain/commands/send-notification.command';
import { NotificationService } from '@notification/application/notification.service';
import { NotificationM } from '@notification/domain/notification';

@CommandHandler(SendNotificationCommand)
export class SendNotificationHandler
  implements ICommandHandler<SendNotificationCommand>
{
  constructor(private readonly notificationService: NotificationService) {}

  async execute(command: SendNotificationCommand): Promise<NotificationM> {
    return this.notificationService.createNotification(command);
  }
}
