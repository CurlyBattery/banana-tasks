import { Module } from '@nestjs/common';
import { NotificationService } from '@notification/application/notification.service';
import { NotificationRepository } from '@notification/domain/notification.repository';
import { PrismaNotificationRepository } from '@notification/infrastructure/prisma-notification.repository';
import { NotificationResolver } from '@notification/infrastructure/presentation/notification.resolver';
import { SendNotificationHandler } from '@notification/application/handlers/send-notification.handler';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RedisService } from '@notification/application/redis.service';

const CommandHandlers = [SendNotificationHandler];

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [{ name: 'notifications-exchange', type: 'topic' }],
      uri: 'amqp://localhost:5672',
    }),
  ],
  providers: [
    NotificationService,
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationRepository,
    },
    NotificationResolver,
    RedisService,
    ...CommandHandlers,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
