import { Role } from 'generated/prisma';

export class UserPayload {
  sub: number;
  email: string;
  role: Role;
}
