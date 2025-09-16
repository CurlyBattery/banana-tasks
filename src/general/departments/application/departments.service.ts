import { Injectable } from '@nestjs/common';
import { DepartmentRepository } from '@departments/domain/department.repository';

@Injectable()
export class DepartmentsService {
  constructor(private readonly departmentRepo: DepartmentRepository) {}

  async listDepartments() {
    return this.departmentRepo.list();
  }
}
