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

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();

    const cookies = cookieFactory(ctx.res, ctx.req);

    const token = cookies.get('access_token');
    if (!token) {
      throw new UnauthorizedException('Not Found Access Token');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('AT_JWT_SECRET'),
        ignoreExpiration: false,
      });

      ctx.req.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid Access Token');
    }
    return true;
  }
}
