import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';

import { UsersService } from '@user/application/users.service';
import { CreateUserInput } from '@user/infrastructure/presentation/dto/create-user.input';
import { UpdateUserInput } from '@user/infrastructure/presentation/dto/update-user.input';
import { UserM } from '@user/domain/user';

@Resolver('User')
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

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

  @Mutation('removeUser')
  remove(@Args('id') id: number) {
    return this.usersService.deleteUser(id);
  }

  @Query('getUsers')
  findAll() {
    return this.usersService.listUsers();
  }

  @Query('getUser')
  findOne(@Args('id') id: number) {
    return this.usersService.getUser(id);
  }
}
