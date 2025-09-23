import { Module } from '@nestjs/common';

import { TasksService } from '@tasks/application/tasks.service';
import { TaskRepository } from '@tasks/domain/task.repository';
import { PrismaTaskRepository } from '@tasks/infrastructure/prisma-task.repository';
import { TaskResolver } from '@tasks/infrastructure/persistence/task.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { TasksSearchService } from '@tasks/application/tasks-search.service';
import { SearchModule } from '@search/search.module';

@Module({
  imports: [CqrsModule, SearchModule],
  providers: [
    TasksService,
    TasksSearchService,
    {
      provide: TaskRepository,
      useClass: PrismaTaskRepository,
    },
    TaskResolver,
  ],
})
export class TasksModule {}
