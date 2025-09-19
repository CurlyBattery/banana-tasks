import { Module } from '@nestjs/common';
import { NotificationService } from '@notification/application/notification.service';
import { NotificationRepository } from '@notification/domain/notification.repository';
import { PrismaNotificationRepository } from '@notification/infrastructure/prisma-notification.repository';
import { NotificationResolver } from '@notification/infrastructure/presentation/notification.resolver';
import { SendNotificationHandler } from '@notification/application/handlers/send-notification.handler';

const CommandHandlers = [SendNotificationHandler];

@Module({
  providers: [
    NotificationService,
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationRepository,
    },
    NotificationResolver,
    ...CommandHandlers,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
