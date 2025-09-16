import { Role } from '../../../../generated/prisma';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { AccessTokenGuard } from '@common/guards/access-token.guard';
import { GqlExecutionContext } from '@nestjs/graphql';

const RoleGuard = (roles: Role[]): Type<CanActivate> => {
  class RoleGuardMixin extends AccessTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);

      const gqlContext = GqlExecutionContext.create(context);
      const { req } = gqlContext.getContext();
      const user = req.user;

      return roles.includes(user?.role);
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
