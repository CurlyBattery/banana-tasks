import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UserFilterQuery {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  departmentId?: number;
}
