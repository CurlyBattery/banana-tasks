import { Injectable } from '@nestjs/common';

import { NotificationM } from '@notification/domain/notification';
import { CreateNotificationInput } from '@notification/infrastructure/presentation/dto/create-notification.input';
import { NotificationRepository } from '@notification/domain/notification.repository';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async createNotification(
    createNotificationInput: CreateNotificationInput,
  ): Promise<NotificationM> {
    return this.notificationRepo.create(createNotificationInput);
  }

  async getUserNotifications(userId: number): Promise<NotificationM[]> {
    return this.notificationRepo.findAll({ userId });
  }

  async markAsRead(userId: number): Promise<NotificationM[]> {
    return this.notificationRepo.update({ userId }, { isRead: true });
  }
}
