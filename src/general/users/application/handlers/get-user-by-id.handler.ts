import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '@user/domain/queries/get-user-by-id.query';
import { UserRepository } from '@user/domain/user.repository';
import { UserM } from '@user/domain/user';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(query: GetUserByIdQuery): Promise<UserM> {
    return await this.userRepo.findById(query.userId);
  }
}
