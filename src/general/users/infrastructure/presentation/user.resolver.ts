import { Mutation, Query, Resolver, Args, Context } from '@nestjs/graphql';
import { Request, Response } from 'express';

import { UsersService } from '@user/application/users.service';
import { CreateUserInput } from '@user/infrastructure/presentation/dto/create-user.input';
import { UpdateUserInput } from '@user/infrastructure/presentation/dto/update-user.input';
import { UserM } from '@user/domain/user';
import { UseGuards } from '@nestjs/common';
import RoleGuard from '@common/guards/roles.guard';
import { Role } from '../../../../../generated/prisma';

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
  remove(@Args('id') id: number) {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(RoleGuard([Role.ADMINISTRATOR, Role.HEAD_DEPARTMENT]))
  @Query('getUsers')
  findAll() {
    return this.usersService.listUsers();
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
