import { Injectable } from '@nestjs/common';
import { TaskRepository } from '@tasks/domain/task.repository';
import { TaskM } from '@tasks/domain/task';
import { CreateTaskInput } from '@tasks/infrastructure/persistence/dto/create-task.input';
import { UpdateTaskInput } from '@tasks/infrastructure/persistence/dto/update-task.input';
import { UpdateTaskStatusInput } from '@tasks/infrastructure/persistence/dto/update-task-status.input';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskStatus } from '../../../../generated/prisma';
import { CommandBus } from '@nestjs/cqrs';
import { SendNotificationCommand } from '@notification/domain/commands/send-notification.command';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepo: TaskRepository,
    private readonly commandBus: CommandBus,
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

    return task;
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
    const task = await this.taskRepo.update(id, {
      title: updateTaskInput.title,
      description: updateTaskInput.description,
      priority: updateTaskInput.priority,
      deadline: updateTaskInput.deadline,
    });

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
    return this.taskRepo.delete(id);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async setOverdueStatus() {
    const tasks = await this.taskRepo.updateMany(
      {
        deadline: {
          lte: new Date(),
        },
      },
      {
        status: TaskStatus.OVERDUE,
      },
      {
        id: true,
        title: true,
        createdById: true,
      },
    );

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
