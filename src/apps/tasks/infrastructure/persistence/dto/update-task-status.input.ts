import { TaskStatus } from '../../../../../../generated/prisma';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTaskStatusInput {
  @IsNumber()
  id?: number;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  taskStatus: TaskStatus;
}
