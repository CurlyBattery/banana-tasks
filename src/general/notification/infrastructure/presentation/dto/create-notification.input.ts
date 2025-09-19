import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationInput {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  data: string;
}
