import { Module } from '@nestjs/common';
import { DepartmentsService } from '@departments/application/departments.service';
import { DepartmentRepository } from '@departments/domain/department.repository';
import { PrismaDepartmentRepository } from '@departments/infrastructure/prisma-department.repository';
import { DepartmentResolver } from '@departments/infrastructure/presentation/department.resolver';

@Module({
  providers: [
    DepartmentsService,
    {
      provide: DepartmentRepository,
      useClass: PrismaDepartmentRepository,
    },
    DepartmentResolver,
  ],
})
export class DepartmentsModule {}
