import { TaskStatus } from 'generated/prisma';

export class TaskM {
  id?: number;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: number;
  deadline: Date;
  assignedToId?: number;
  createdById?: number;

  constructor(partial: Partial<TaskM>) {
    Object.assign(this, partial);
  }
}
