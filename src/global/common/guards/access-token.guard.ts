import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { cookieFactory } from '../../libs/auth/cookie.lib';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@common/decorators/public.decorator';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const ctx = GqlExecutionContext.create(context).getContext();

    const cookies = cookieFactory(ctx.res, ctx.req);

    const token = cookies.get('access_token');
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('AT_JWT_SECRET'),
        ignoreExpiration: false,
      });

      ctx.req.user = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
