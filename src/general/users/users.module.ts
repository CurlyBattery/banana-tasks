import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { UserRepository } from '@user/domain/user.repository';
import { PrismaUserRepository } from '@user/infrastructure/prisma-user.repository';
import { UsersService } from '@user/application/users.service';
import { EncryptionModule } from '@hashing/encryption.module';
import { UserResolver } from '@user/infrastructure/presentation/user.resolver';
import { RegisterUserHandler } from '@user/application/handlers/register-user.handler';
import { GetUserByEmailHandler } from '@user/application/handlers/get-user-by-email.handler';
import { CheckPasswordHandler } from '@user/application/handlers/check-password.handler';

const CommandHandlers = [RegisterUserHandler, CheckPasswordHandler];
const QueryHandlers = [GetUserByEmailHandler];

@Module({
  imports: [EncryptionModule, CqrsModule],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    UsersService,
    UserResolver,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [],
})
export class UsersModule {}
