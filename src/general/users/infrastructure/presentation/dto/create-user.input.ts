import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from 'generated/prisma';

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

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
