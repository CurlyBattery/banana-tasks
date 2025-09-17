import { Mutation, Query, Resolver, Args, Context } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { UseGuards } from '@nestjs/common';

import { UsersService } from '@user/application/users.service';
import { CreateUserInput } from '@user/infrastructure/presentation/dto/create-user.input';
import { UpdateUserInput } from '@user/infrastructure/presentation/dto/update-user.input';
import { UserM } from '@user/domain/user';
import RoleGuard from '@common/guards/roles.guard';
import { Role } from 'generated/prisma';
import { UserFilterQuery } from '@user/infrastructure/presentation/dto/user-filter.query';

@Resolver('User')
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RoleGuard([Role.ADMINISTRATOR, Role.HEAD_DEPARTMENT]))
  @Mutation('createUser')
  async create(@Args('createUserInput') createUserInput: CreateUserInput) {
    const user = await this.usersService.createUser(createUserInput);
    return new UserM({ ...user });
  }

  @Mutation('updateUser')
  update(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    const { id, ...data } = updateUserInput;
    return this.usersService.updateUser(id, data);
  }

  @UseGuards(RoleGuard([Role.ADMINISTRATOR]))
  @Mutation('removeUser')
  remove(
    @Args('id') id: number,
    @Context() context: { req: Request; res: Response },
  ) {
    const { req } = context;

    const userId = req.user['sub'];
    return this.usersService.deleteUser(id, userId);
  }

  @UseGuards(RoleGuard([Role.ADMINISTRATOR, Role.HEAD_DEPARTMENT]))
  @Query('getUsers')
  findAll(@Args('query') query?: UserFilterQuery) {
    return this.usersService.listUsers(query);
  }

  @Query('getUser')
  findOne(
    @Args('id') id: number,
    @Context() context: { req: Request; res: Response },
  ) {
    const { req } = context;

    const userId = req.user['sub'];
    return this.usersService.getUser(id, userId);
  }
}
