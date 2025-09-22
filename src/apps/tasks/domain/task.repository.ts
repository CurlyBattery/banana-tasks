import { TaskM } from '@tasks/domain/task';
import { Prisma } from 'generated/prisma';

export abstract class TaskRepository {
  abstract create(task: TaskM): Promise<TaskM>;
  abstract findById(id: number): Promise<TaskM>;
  abstract update(id: number, task: Partial<TaskM>): Promise<TaskM>;
  abstract updateMany(
    where: Prisma.TaskWhereInput,
    task: Partial<TaskM>,
    select?: Prisma.TaskSelect,
  ): Promise<TaskM[]>;
  abstract delete(id: number): Promise<TaskM>;
  abstract list(where?: Prisma.TaskWhereInput): Promise<TaskM[]>;
}
