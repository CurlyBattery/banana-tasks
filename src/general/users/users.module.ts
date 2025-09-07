import { Module } from '@nestjs/common';
import { UserRepository } from '@user/domain/user.repository';
import { PrismaUserRepository } from '@user/infrastructure/prisma-user.repository';
import { UsersService } from '@user/application/users.service';
import { EncryptionModule } from '@hashing/encryption.module';
import { UserResolver } from '@user/infrastructure/presentation/user.resolver';

@Module({
  imports: [EncryptionModule],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    UsersService,
    UserResolver,
  ],
  exports: [],
})
export class UsersModule {}
