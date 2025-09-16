import { DepartmentM } from '@departments/domain/department';

export abstract class DepartmentRepository {
  abstract list(): Promise<DepartmentM[]>;
}
