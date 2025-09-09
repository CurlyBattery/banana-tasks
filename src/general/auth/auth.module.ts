import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';

import { RefreshRepository } from '@auth/domain/refresh.repository';
import { PrismaRefreshRepository } from '@auth/infrastructure/prisma-refresh.repository';
import { AuthService } from '@auth/application/auth.service';
import { AuthResolver } from '@auth/infrastructure/persistence/auth.resolver';
import { EncryptionModule } from '@hashing/encryption.module';
import { AccessTokenGuard } from '@common/guards/access-token.guard';
import { RefreshTokenGuard } from '@common/guards/refresh-token.guard';
import { APP_GUARD } from '@nestjs/core';
import { config } from '@common/config/config';

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      global: true,
      secret: config().at_secret,
      signOptions: {
        expiresIn: config().at_exp,
      },
    }),
    EncryptionModule,
  ],
  providers: [
    {
      provide: RefreshRepository,
      useClass: PrismaRefreshRepository,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    AuthService,
    AuthResolver,
    RefreshTokenGuard,
  ],
})
export class AuthModule {}
