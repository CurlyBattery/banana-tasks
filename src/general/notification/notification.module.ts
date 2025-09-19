import { Module } from '@nestjs/common';
import { NotificationService } from '@notification/application/notification.service';
import { NotificationRepository } from '@notification/domain/notification.repository';
import { PrismaNotificationRepository } from '@notification/infrastructure/prisma-notification.repository';

@Module({
  providers: [
    NotificationService,
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationRepository,
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
