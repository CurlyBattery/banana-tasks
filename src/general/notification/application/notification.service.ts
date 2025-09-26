import { Injectable } from '@nestjs/common';

import { NotificationM } from '@notification/domain/notification';
import { CreateNotificationInput } from '@notification/infrastructure/presentation/dto/create-notification.input';
import { NotificationRepository } from '@notification/domain/notification.repository';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepo: NotificationRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async createNotification(
    createNotificationInput: CreateNotificationInput,
  ): Promise<NotificationM> {
    const notif = await this.notificationRepo.create(createNotificationInput);

    await this.amqpConnection.publish(
      'notifications-exchange',
      'notifications.key',
      {
        id: notif.id,
        title: notif.title,
        data: notif.data,
        userId: notif.userId,
        isRead: notif.isRead,
        createdAt: notif.createdAt,
      },
    );

    return notif;
  }

  async getUserNotifications(userId: number): Promise<NotificationM[]> {
    return this.notificationRepo.findAll({ userId });
  }

  async markAsRead(userId: number): Promise<NotificationM[]> {
    return this.notificationRepo.update({ userId }, { isRead: true });
  }
}
