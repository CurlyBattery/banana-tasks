import { Injectable } from '@nestjs/common';
import { RedisService } from '@notification/application/redis.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class NotificationConsumer {
  constructor(private readonly redisService: RedisService) {}

  @RabbitSubscribe({
    exchange: 'notifications-exchange',
    routingKey: 'notifications.key',
    queue: 'notifications-queue',
  })
  async handleNotification(msg: any) {
    await this.redisService.publish('notifications', JSON.stringify(msg));
  }
}
