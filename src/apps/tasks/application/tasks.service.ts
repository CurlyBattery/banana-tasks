import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';

import { TaskStatus } from 'generated/prisma';
import { TaskRepository } from '@tasks/domain/task.repository';
import { TaskM } from '@tasks/domain/task';
import { CreateTaskInput } from '@tasks/infrastructure/persistence/dto/create-task.input';
import { UpdateTaskInput } from '@tasks/infrastructure/persistence/dto/update-task.input';
import { UpdateTaskStatusInput } from '@tasks/infrastructure/persistence/dto/update-task-status.input';
import { SendNotificationCommand } from '@notification/domain/commands/send-notification.command';
import { TasksSearchService } from '@tasks/application/tasks-search.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepo: TaskRepository,
    private readonly commandBus: CommandBus,
    private readonly tasksSearchService: TasksSearchService,
  ) {}

  async createTask(createTaskInput: CreateTaskInput): Promise<TaskM> {
    const task = await this.taskRepo.create(createTaskInput);

    await this.commandBus.execute(
      new SendNotificationCommand(
        createTaskInput.assignedToId,
        `Новая задача.`,
        `Задача создана: ${createTaskInput.title}.`,
      ),
    );
    await this.tasksSearchService.indexTask(task);

    return task;
  }

  async getTask(id: number): Promise<TaskM> {
    return this.taskRepo.findById(id);
  }

  async listMyTasks(assignedToId: number, text?: string) {
    if (!text) {
      return this.taskRepo.list({
        assignedToId,
      });
    }
    const results = await this.tasksSearchService.search(text);
    const ids = results.map((task) => task.id);
    if (!ids.length) {
      return [];
    }
    const tasks = await this.taskRepo.list({
      id: { in: ids },
      assignedToId,
    });

    return tasks;
  }

  async listCreatorTasks(createdById: number, text?: string) {
    if (!text) {
      return this.taskRepo.list({
        createdById,
      });
    }
    const results = await this.tasksSearchService.search(text);
    const ids = results.map((task) => task.id);
    if (!ids.length) {
      return [];
    }
    const tasks = await this.taskRepo.list({
      id: { in: ids },
      createdById,
    });

    return tasks;
  }

  async updateTask(
    id: number,
    updateTaskInput: UpdateTaskInput,
  ): Promise<TaskM> {
    const task = await this.taskRepo.update(id, {
      title: updateTaskInput.title,
      description: updateTaskInput.description,
      priority: updateTaskInput.priority,
      deadline: updateTaskInput.deadline,
      createdAt: updateTaskInput.createdAt,
    });

    await this.tasksSearchService.update(task);

    await this.commandBus.execute(
      new SendNotificationCommand(
        task.assignedToId,
        `Изменение задачи.`,
        `Теперь задачи выглядит вот так: \nДедлайн: ${task.deadline}\nНазвание: ${task.title}\nОписание: ${task.description}\nПриоритет: ${task.priority}`,
      ),
    );

    return task;
  }

  async updateTaskStatus(
    id: number,
    updateTaskStatusInput: UpdateTaskStatusInput,
  ): Promise<TaskM> {
    const task = await this.taskRepo.update(id, {
      status: updateTaskStatusInput.status,
    });

    await this.commandBus.execute(
      new SendNotificationCommand(
        task.createdById,
        `Изменение статуса.`,
        `У задачи ${task.title} изменен статус на ${task.status}.`,
      ),
    );

    return task;
  }

  async deleteTask(id: number): Promise<TaskM> {
    const task = await this.taskRepo.delete(id);

    await this.tasksSearchService.remove(id);

    return task;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async setOverdueStatus() {
    const tasks = await this.taskRepo.updateMany(
      {
        deadline: {
          lte: new Date(),
        },
        status: {
          notIn: [TaskStatus.OVERDUE],
        },
      },
      {
        status: TaskStatus.OVERDUE,
      },
      {
        id: true,
        title: true,
        createdById: true,
        assignedToId: true,
      },
    );
    if (tasks.length === 0) {
      return tasks;
    }

    for (const value of tasks) {
      await this.commandBus.execute(
        new SendNotificationCommand(
          value.assignedToId,
          `Окончание дедлайна.`,
          `Задача просрочена: ${value.title}.`,
        ),
      );
    }

    return tasks;
  }
}
