import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const Cookie = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const request = gqlCtx.getContext().req;

    if (!request || !request.cookies) return null;

    return key && key in request.cookies
      ? request.cookies[key]
      : key
        ? null
        : request.cookies;
  },
);
