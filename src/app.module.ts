import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import * as Joi from 'joi';
import * as process from 'node:process';

import { PrismaModule } from '@prisma/prisma.module';
import { GeneralModule } from './general/general.module';
import { TasksModule } from '@tasks/tasks.module';
import { SeedModule } from './global/libs/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async () => ({
        typePaths: ['./**/**/**/domain/graphql/*.graphql'],
        definitions: {
          path: join(process.cwd(), 'src/generated/graphql.ts'),
        },
        sortSchema: true,
      }),
    }),
    GeneralModule,
    TasksModule,
    PrismaModule,
    SeedModule,
  ],
})
export class AppModule {}
