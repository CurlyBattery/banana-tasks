import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { TaskStatus } from '../../../../../generated/graphql';

export class UpdateTaskStatusInput {
  @IsNumber()
  id?: number;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;
}
