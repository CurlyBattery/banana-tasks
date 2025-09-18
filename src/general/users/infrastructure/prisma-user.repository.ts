import { Injectable } from '@nestjs/common';

import { Prisma } from 'generated/prisma';
import { UserM } from '@user/domain/user';
import { UserRepository } from '@user/domain/user.repository';
import { PrismaService } from '@prisma/application/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: UserM): Promise<UserM> {
    return this.prisma.user.create({
      data: {
        email: user.email,
        departmentId: user.departmentId,
        fullName: user.fullName,
        passwordHash: user.passwordHash,
        role: user.role,
      },
    });
  }
  async findById(id: number): Promise<UserM> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async findByEmail(email: string): Promise<UserM> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async update(
    id: number,
    { departmentId, email, fullName, isActive, timezone }: Partial<UserM>,
  ): Promise<UserM> {
    return this.prisma.user.update({
      where: { id },
      data: {
        departmentId,
        email,
        fullName,
        isActive,
        timezone,
      },
    });
  }
  async delete(id: number): Promise<UserM> {
    return this.prisma.user.delete({ where: { id } });
  }
  async list(where?: Prisma.UserWhereInput): Promise<UserM[]> {
    return this.prisma.user.findMany({
      where,
    });
  }
}
