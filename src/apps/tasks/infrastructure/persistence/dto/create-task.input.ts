import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskStatus } from '../../../../../../generated/prisma';

export class CreateTaskInput {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  taskStatus?: TaskStatus;

  @IsNumber()
  @IsOptional()
  priority?: number;

  @IsString()
  @IsNotEmpty()
  deadline: Date;

  @IsNumber()
  @IsNotEmpty()
  assignedToId: number;

  @IsNumber()
  @IsOptional()
  createdById?: number;
}
