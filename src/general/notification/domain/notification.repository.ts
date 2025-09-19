import { NotificationM } from '@notification/domain/notification';
import { Prisma } from 'generated/prisma';

export abstract class NotificationRepository {
  abstract create(notification: NotificationM): Promise<NotificationM>;
  abstract findAll(
    where?: Prisma.NotificationWhereInput,
  ): Promise<NotificationM[]>;
  abstract update(
    where: Prisma.NotificationWhereInput,
    notification: Partial<NotificationM>,
  ): Promise<NotificationM[]>;
}
