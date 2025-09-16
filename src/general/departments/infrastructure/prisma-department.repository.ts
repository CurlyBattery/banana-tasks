import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/application/prisma.service';
import { DepartmentRepository } from '@departments/domain/department.repository';
import { DepartmentM } from '@departments/domain/department';

@Injectable()
export class PrismaDepartmentRepository implements DepartmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  list(): Promise<DepartmentM[]> {
    return this.prisma.department.findMany();
  }
}
