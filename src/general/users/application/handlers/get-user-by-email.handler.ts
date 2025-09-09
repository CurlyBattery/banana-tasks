import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserRepository } from '@user/domain/user.repository';
import { UserM } from '@user/domain/user';
import { GetUserByEmailQuery } from '@user/domain/queries/get-user-by-email.query';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler
  implements IQueryHandler<GetUserByEmailQuery>
{
  constructor(private readonly userRepo: UserRepository) {}

  async execute(query: GetUserByEmailQuery): Promise<UserM> {
    return await this.userRepo.findByEmail(query.email);
  }
}
