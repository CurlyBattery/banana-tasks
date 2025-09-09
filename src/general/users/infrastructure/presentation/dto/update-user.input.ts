import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserInput {
  @IsNumber()
  id?: number;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsNotEmpty()
  @IsOptional()
  departmentId: number;
}
