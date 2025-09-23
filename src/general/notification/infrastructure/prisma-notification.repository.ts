import { Injectable } from '@nestjs/common';
import { NotificationM } from '@notification/domain/notification';
import { NotificationRepository } from '@notification/domain/notification.repository';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '@prisma/application/prisma.service';

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(notification: NotificationM): Promise<NotificationM> {
    return this.prisma.notification.create({
      data: {
        title: notification.title,
        data: notification.data,
        userId: notification.userId,
      },
    });
  }
  findAll(where?: Prisma.NotificationWhereInput): Promise<NotificationM[]> {
    return this.prisma.notification.findMany({
      where,
    });
  }
  update(
    where: Prisma.NotificationWhereInput,
    notification: Partial<NotificationM>,
  ): Promise<NotificationM[]> {
    return this.prisma.notification.updateManyAndReturn({
      where,
      data: notification,
    });
  }
}
