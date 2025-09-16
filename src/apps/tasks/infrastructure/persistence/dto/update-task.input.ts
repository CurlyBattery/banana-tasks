import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateTaskInput {
  @IsNumber()
  id?: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  priority: number;

  @IsDateString()
  @IsNotEmpty()
  deadline: Date;
}
