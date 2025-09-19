import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNotificationInput {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  data: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
