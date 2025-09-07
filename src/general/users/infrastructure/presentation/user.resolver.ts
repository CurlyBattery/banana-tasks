import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import { UsersService } from '@user/application/users.service';
import { CreateUserInput } from '@user/infrastructure/presentation/dto/create-user.input';
import { UpdateUserInput } from '@user/infrastructure/presentation/dto/update-user.input';

@Resolver('User')
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation('createUser')
  create(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.createUser(createUserInput);
  }

  @Mutation('updateUser')
  update(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.updateUser(updateUserInput.id, updateUserInput);
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
