import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';

import { TasksService } from '@tasks/application/tasks.service';
import { CreateTaskInput } from '@tasks/infrastructure/persistence/dto/create-task.input';
import { TaskM } from '@tasks/domain/task';
import { UpdateTaskInput } from '@tasks/infrastructure/persistence/dto/update-task.input';
import { UpdateTaskStatusInput } from '@tasks/infrastructure/persistence/dto/update-task-status.input';

@Resolver('Task')
export class TaskResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Mutation('createTask')
  async create(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ): Promise<TaskM> {
    const task = await this.tasksService.createTask(createTaskInput);
    return new TaskM({ ...task });
  }

  @Mutation('updateTask')
  async update(@Args('updateTaskInput') updateTaskInput: UpdateTaskInput) {
    const { id, ...data } = updateTaskInput;
    return this.tasksService.updateTask(id, data);
  }

  @Mutation('updateTaskStatus')
  async updateStatus(
    @Args('updateTaskInput') updateTaskStatusInput: UpdateTaskStatusInput,
  ) {
    const { id, ...data } = updateTaskStatusInput;
    return this.tasksService.updateTaskStatus(id, data);
  }

  @Mutation('removeTask')
  async remove(@Args('id') id: number) {
    return this.tasksService.deleteTask(id);
  }

  @Query('getTasks')
  async findAll() {
    return this.tasksService.listTasks();
  }

  @Query('getTask')
  async findOne(@Args('id') id: number) {
    return this.tasksService.getTask(id);
  }
}
