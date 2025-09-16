import { Mutation, Query, Resolver, Args, Context } from '@nestjs/graphql';

import { TasksService } from '@tasks/application/tasks.service';
import { CreateTaskInput } from '@tasks/infrastructure/persistence/dto/create-task.input';
import { TaskM } from '@tasks/domain/task';
import { UpdateTaskInput } from '@tasks/infrastructure/persistence/dto/update-task.input';
import { UpdateTaskStatusInput } from '@tasks/infrastructure/persistence/dto/update-task-status.input';
import { Request, Response } from 'express';

@Resolver('Task')
export class TaskResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Mutation('createTask')
  async create(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
    @Context() context: { req: Request; res: Response },
  ): Promise<TaskM> {
    const { req } = context;

    const userId = req.user['sub'];

    const task = await this.tasksService.createTask({
      ...createTaskInput,
      createdById: userId,
    });
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

  @Query('getMyTasks')
  async findMy(@Context() context: { req: Request; res: Response }) {
    const { req } = context;

    const assignedToId = req.user['sub'];

    return this.tasksService.listMyTasks(assignedToId);
  }

  @Query('getCreatorTasks')
  async findByCreator(@Context() context: { req: Request; res: Response }) {
    const { req } = context;

    const createdById = req.user['sub'];
    console.log(createdById);

    return this.tasksService.listCreatorTasks(createdById);
  }

  @Query('getTask')
  async findOne(@Args('id') id: number) {
    return this.tasksService.getTask(id);
  }
}
