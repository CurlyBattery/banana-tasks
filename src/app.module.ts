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
import { SeedModule } from '@seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        AT_JWT_SECRET: Joi.string().required(),
        AT_EXPIRES_IN: Joi.string().required(),
        RT_JWT_SECRET: Joi.string().required(),
        RT_EXPIRES_IN: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async () => ({
        typePaths: [
          join(process.cwd(), 'src/general/**/domain/graphql/*.graphql'),
          join(process.cwd(), 'src/apps/**/domain/graphql/*.graphql'),
        ],
        definitions: {
          path: join(process.cwd(), 'src/generated/graphql.ts'),
        },
        context: ({ req, res }) => ({ req, res }),
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
