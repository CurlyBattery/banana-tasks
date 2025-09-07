import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsNotEmpty()
  @IsNotEmpty()
  departmentId: number;
}
