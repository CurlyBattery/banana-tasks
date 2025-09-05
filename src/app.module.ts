import { Module } from '@nestjs/common';
import { GeneralModule } from './general/general.module';
import { TasksModule } from './apps/tasks/tasks.module';
import { PrismaModule } from '@prisma/prisma.module';

@Module({
  imports: [GeneralModule, TasksModule, PrismaModule],
})
export class AppModule {}
