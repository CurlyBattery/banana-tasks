import { Module } from '@nestjs/common';
import { GeneralModule } from './general/general.module';
import { TasksModule } from './apps/tasks/tasks.module';

@Module({
  imports: [GeneralModule, TasksModule],
})
export class AppModule {}
