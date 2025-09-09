import { Injectable } from '@nestjs/common';

import { UserM } from '@user/domain/user';
import { UserRepository } from '@user/domain/user.repository';
import { PrismaService } from '@prisma/application/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: UserM): Promise<UserM> {
    return this.prisma.user.create({
      data: user,
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
    { departmentId, email, fullName }: Partial<UserM>,
  ): Promise<UserM> {
    return this.prisma.user.update({
      where: { id },
      data: {
        departmentId,
        email,
        fullName,
      },
    });
  }
  async delete(id: number): Promise<UserM> {
    return this.prisma.user.delete({ where: { id } });
  }
  async list(): Promise<UserM[]> {
    return this.prisma.user.findMany();
  }
}
