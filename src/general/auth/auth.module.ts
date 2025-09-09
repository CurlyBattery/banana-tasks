import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { RefreshRepository } from '@auth/domain/refresh.repository';
import { PrismaRefreshRepository } from '@auth/infrastructure/prisma-refresh.repository';
import { AuthService } from '@auth/application/auth.service';
import { AuthResolver } from '@auth/infrastructure/persistence/auth.resolver';
import { EncryptionModule } from '@hashing/encryption.module';
import { AccessTokenGuard } from '@common/guards/access-token.guard';

@Module({
  imports: [
    CqrsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('AT_JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('AT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    EncryptionModule,
  ],
  providers: [
    {
      provide: RefreshRepository,
      useClass: PrismaRefreshRepository,
    },
    AuthService,
    AuthResolver,
    AccessTokenGuard,
  ],
})
export class AuthModule {}
