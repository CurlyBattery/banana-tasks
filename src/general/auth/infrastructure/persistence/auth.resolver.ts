import { Mutation, Resolver, Args, Context, Query } from '@nestjs/graphql';
import { Request, Response } from 'express';

import { CreateUserInput } from '@user/infrastructure/presentation/dto/create-user.input';
import { AuthService } from '@auth/application/auth.service';
import { SignInInput } from '@auth/infrastructure/persistence/dto/sign-in.input';
import { cookieFactory } from '../../../../global/libs/auth/cookie.lib';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from '@common/guards/refresh-token.guard';
import { Public } from '@common/decorators/public.decorator';
import { convertToMiliSecondsUtil } from '@common/utils/convert-to-mili-seconds.util';
import { config } from '@common/config/config';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation('signUp')
  signUp(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.register(createUserInput);
  }

  @Public()
  @Mutation('signIn')
  async signIn(
    @Context() context: { req: Request; res: Response },
    @Args('signInInput') signInInput: SignInInput,
  ) {
    const { req, res } = context;
    const cookies = cookieFactory(res, req);
    const { accessToken, refreshToken } =
      await this.authService.login(signInInput);

    cookies.set(
      'access_token',
      accessToken,
      convertToMiliSecondsUtil(config().at_exp),
    );
    cookies.set(
      'refresh_token',
      refreshToken,
      convertToMiliSecondsUtil(config().rt_exp),
    );

    return { accessToken, refreshToken };
  }

  @UseGuards(RefreshTokenGuard)
  @Mutation('refresh')
  async refreshTokens(@Context() context: { req: Request; res: Response }) {
    const { req, res } = context;
    const cookies = cookieFactory(res, req);

    const userId = req.user['userId'];
    const oldRefresh = cookies.get('refresh_token');

    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      userId,
      oldRefresh,
    );

    return { accessToken, refreshToken };
  }

  @UseGuards(RefreshTokenGuard)
  @Query('logout')
  async logout(@Context() context: { req: Request; res: Response }) {
    const { req, res } = context;
    const cookies = cookieFactory(res, req);

    const userId = req.user['userId'];

    const isDeleted = await this.authService.logout(userId);
    if (!isDeleted) {
      throw new BadRequestException('Error Delete Refresh Token');
    }

    cookies.remove('access_token');
    cookies.remove('refresh_token');

    return { success: true };
  }

  @Query('me')
  async getAuthenticateUser(
    @Context() context: { req: Request; res: Response },
  ) {
    const { req } = context;

    const userId = req.user['sub'];

    const user = await this.authService.me(userId);

    return user;
  }
}
