import { Injectable } from '@nestjs/common';

import { PrismaService } from '@prisma/application/prisma.service';
import { RefreshRepository } from '@auth/domain/refresh.repository';
import { RefreshM } from '@auth/domain/refresh';

@Injectable()
export class PrismaRefreshRepository implements RefreshRepository {
  constructor(private readonly prisma: PrismaService) {}

  save(refresh: RefreshM): Promise<RefreshM> {
    return this.prisma.refreshToken.upsert({
      where: { userId: refresh.userId },
      update: refresh,
      create: refresh,
    });
  }
  get(userId: number): Promise<RefreshM> {
    return this.prisma.refreshToken.findUnique({
      where: { userId },
    });
  }
  setRevoke(id: number): Promise<RefreshM> {
    return this.prisma.refreshToken.update({
      where: { id },
      data: {
        revoked: true,
      },
    });
  }
  remove(id: number): Promise<RefreshM> {
    return this.prisma.refreshToken.delete({
      where: { id },
    });
  }
}
