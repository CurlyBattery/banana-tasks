export class UserM {
  readonly id?: number;
  email: string;
  passwordHash: string;
  fullName?: string;
  isActive: boolean;
  timezone?: string;
  departmentId: number;

  createdAt?: Date;
  updatedAt?: Date;
}
