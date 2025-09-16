import { Injectable } from '@nestjs/common';
import { TaskRepository } from '@tasks/domain/task.repository';
import { TaskM } from '@tasks/domain/task';
import { CreateTaskInput } from '@tasks/infrastructure/persistence/dto/create-task.input';
import { UpdateTaskInput } from '@tasks/infrastructure/persistence/dto/update-task.input';
import { UpdateTaskStatusInput } from '@tasks/infrastructure/persistence/dto/update-task-status.input';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepo: TaskRepository) {}

  async createTask(createTaskInput: CreateTaskInput): Promise<TaskM> {
    return this.taskRepo.create(createTaskInput);
  }

  async getTask(id: number): Promise<TaskM> {
    return this.getTask(id);
  }

  async listTasks() {
    return this.taskRepo.list();
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
      taskStatus: updateTaskStatusInput.taskStatus,
    });
  }

  async deleteTask(id: number): Promise<TaskM> {
    return this.taskRepo.delete(id);
  }
}
