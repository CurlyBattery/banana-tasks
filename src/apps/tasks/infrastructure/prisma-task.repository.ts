import { Injectable } from '@nestjs/common';
import { TaskM } from '@tasks/domain/task';
import { TaskRepository } from '@tasks/domain/task.repository';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '@prisma/application/prisma.service';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(task: TaskM): Promise<TaskM> {
    return this.prisma.task.create({
      data: task,
    });
  }
  findById(id: number): Promise<TaskM> {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }
  update(id: number, task: Partial<TaskM>): Promise<TaskM> {
    return this.prisma.task.update({
      where: { id },
      data: task,
    });
  }
  updateMany(
    where: Prisma.TaskWhereInput,
    task: Partial<TaskM>,
  ): Promise<TaskM[]> {
    return this.prisma.task.updateManyAndReturn({
      where,
      data: task,
    });
  }
  delete(id: number): Promise<TaskM> {
    return this.prisma.task.delete({
      where: { id },
    });
  }
  list(where?: Prisma.TaskWhereInput): Promise<TaskM[]> {
    return this.prisma.task.findMany({
      where,
    });
  }
}
