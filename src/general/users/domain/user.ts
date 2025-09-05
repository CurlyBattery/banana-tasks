export class UserM {
  constructor(
    readonly id: number,
    public email: string,
    public passwordHash: string,
    public fullName: string,
    public isActive: boolean = true,
    public timezone?: string,

    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  deactivate() {
    this.isActive = false;
  }
}

export class RoleM {
  constructor(
    public readonly id: number,
    public name: string,
    public description?: string,
  ) {}
}

export class UserRoleM {
  constructor(
    public userId: number,
    public roleId: number,
    public assignedAt?: Date,
  ) {}

  changeRole(roleId: number) {
    this.roleId = roleId;
  }
}
