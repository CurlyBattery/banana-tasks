import { Query, Resolver } from '@nestjs/graphql';

import { DepartmentsService } from '@departments/application/departments.service';
import { Public } from '@common/decorators/public.decorator';

@Resolver('Department')
export class DepartmentResolver {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Public()
  @Query('getDepartments')
  findAll() {
    return this.departmentsService.listDepartments();
  }
}
