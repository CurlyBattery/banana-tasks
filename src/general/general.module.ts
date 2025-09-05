import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [AuthModule, UsersModule, NotificationModule],
  exports: [],
})
export class GeneralModule {}
