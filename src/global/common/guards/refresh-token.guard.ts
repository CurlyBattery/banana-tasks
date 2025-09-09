import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { cookieFactory } from '../../libs/auth/cookie.lib';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenPayload } from '@common/interfaces/refresh-token.payload';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();

    const cookies = cookieFactory(ctx.res, ctx.req);

    const token = cookies.get('refresh_token');
    if (!token) {
      throw new UnauthorizedException('Refresh Token not Found');
    }

    try {
      const payload: RefreshTokenPayload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get<string>('RT_JWT_SECRET'),
          ignoreExpiration: true,
        },
      );

      ctx.req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid Refresh Token');
    }
  }
}
