import { Exclude } from 'class-transformer';

export class UserM {
  id?: number;
  email: string;
  @Exclude()
  passwordHash: string;
  fullName?: string;
  isActive?: boolean;
  timezone?: string;
  departmentId: number;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<UserM>) {
    Object.assign(this, partial);
  }
}
