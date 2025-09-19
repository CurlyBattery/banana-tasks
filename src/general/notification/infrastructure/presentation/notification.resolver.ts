import { Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { Request, Response } from 'express';

import { NotificationService } from '@notification/application/notification.service';

@Resolver('Notification')
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  // @Mutation('createNotification')
  // async create(
  //   @Args('createNotificationInput')
  //   createNotificationInput: CreateNotificationInput,
  // ) {
  //   return this.notificationService.createNotification(createNotificationInput);
  // }

  @Mutation('updateRead')
  async update(@Context() context: { req: Request; res: Response }) {
    const { req } = context;

    const userId = req.user['sub'];
    return this.notificationService.markAsRead(userId);
  }

  @Query('getNotifications')
  async getNotifications(@Context() context: { req: Request; res: Response }) {
    const { req } = context;

    const userId = req.user['sub'];
    return this.notificationService.createNotification(userId);
  }
}
