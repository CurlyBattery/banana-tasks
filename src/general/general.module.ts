import { Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@user/users.module';
import { DepartmentsModule } from '@departments/departments.module';
import { NotificationModule } from '@notification/notification.module';

@Module({
  imports: [AuthModule, UsersModule, NotificationModule, DepartmentsModule],
  exports: [],
})
export class GeneralModule {}
