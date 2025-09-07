import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@prisma/application/prisma.service';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDepartments();
  }

  private async seedDepartments() {
    const departments = [
      { id: 1, name: 'IT', description: 'Отдел информационных технологий' },
      { id: 2, name: 'Sales', description: 'Отдел продаж' },
      {
        id: 3,
        name: 'Monitoring',
        description: 'Отдел мониторинга рынка и цен',
      },
      { id: 4, name: 'Admin', description: 'Административный отдел' },
      { id: 5, name: 'Development', description: 'Отдел разработки' },
    ];

    for (const department of departments) {
      await this.prisma.department.upsert({
        where: { id: department.id },
        update: {},
        create: { ...department },
      });
    }
    console.log('Departments successfully seeded');
    this.logger.log('Departments successfully seeded');
  }
}
