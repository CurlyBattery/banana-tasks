import { Injectable } from '@nestjs/common';
import { TaskRepository } from '@tasks/domain/task.repository';
import { TaskM } from '@tasks/domain/task';
import { CreateTaskInput } from '@tasks/infrastructure/persistence/dto/create-task.input';
import { UpdateTaskInput } from '@tasks/infrastructure/persistence/dto/update-task.input';
import { UpdateTaskStatusInput } from '@tasks/infrastructure/persistence/dto/update-task-status.input';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskStatus } from '../../../../generated/prisma';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepo: TaskRepository) {}

  async createTask(createTaskInput: CreateTaskInput): Promise<TaskM> {
    return this.taskRepo.create(createTaskInput);
  }

  async getTask(id: number): Promise<TaskM> {
    return this.taskRepo.findById(id);
  }

  async listMyTasks(assignedToId: number) {
    return this.taskRepo.list({
      assignedToId,
    });
  }

  async listCreatorTasks(createdById: number) {
    return this.taskRepo.list({
      createdById,
    });
  }

  async updateTask(
    id: number,
    updateTaskInput: UpdateTaskInput,
  ): Promise<TaskM> {
    return this.taskRepo.update(id, {
      title: updateTaskInput.title,
      description: updateTaskInput.description,
      priority: updateTaskInput.priority,
      deadline: updateTaskInput.deadline,
    });
  }

  async updateTaskStatus(
    id: number,
    updateTaskStatusInput: UpdateTaskStatusInput,
  ): Promise<TaskM> {
    return this.taskRepo.update(id, {
      status: updateTaskStatusInput.status,
    });
  }

  async deleteTask(id: number): Promise<TaskM> {
    return this.taskRepo.delete(id);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async setOverdueStatus() {
    return this.taskRepo.updateMany(
      {
        deadline: {
          lte: new Date(),
        },
      },
      {
        status: TaskStatus.OVERDUE,
      },
    );
  }
}
