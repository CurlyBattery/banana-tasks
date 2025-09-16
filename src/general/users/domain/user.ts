import { Exclude } from 'class-transformer';

import { Role } from 'generated/prisma';

export class UserM {
  readonly id?: number;
  email: string;
  @Exclude()
  passwordHash: string;
  fullName?: string;
  isActive?: boolean;
  timezone?: string;
  departmentId: number;
  role?: Role;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<UserM>) {
    Object.assign(this, partial);
  }
}
