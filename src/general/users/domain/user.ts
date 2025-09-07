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

export class RoleM {
  id?: number;
  name: string;
  description?: string;
}

export class UserRoleM {
  userId: number;
  roleId: number;
  assignedAt?: Date;
}
