import { Module } from '@nestjs/common';

import { TasksService } from '@tasks/application/tasks.service';
import { TaskRepository } from '@tasks/domain/task.repository';
import { PrismaTaskRepository } from '@tasks/infrastructure/prisma-task.repository';
import { TaskResolver } from '@tasks/infrastructure/persistence/task.resolver';

@Module({
  imports: [],
  providers: [
    TasksService,
    {
      provide: TaskRepository,
      useClass: PrismaTaskRepository,
    },
    TaskResolver,
  ],
})
export class TasksModule {}
