import { Mutation, Resolver, Args, Context, Query } from '@nestjs/graphql';
import { Request, Response } from 'express';

import { CreateUserInput } from '@user/infrastructure/presentation/dto/create-user.input';
import { AuthService } from '@auth/application/auth.service';
import { SignInInput } from '@auth/infrastructure/persistence/dto/sign-in.input';
import { cookieFactory } from '../../../../global/libs/auth/cookie.lib';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '@common/guards/access-token.guard';
import { RefreshTokenGuard } from '@common/guards/refresh-token.guard';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('signUp')
  signUp(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.register(createUserInput);
  }

  @Mutation('signIn')
  async signIn(
    @Context() context: { req: Request; res: Response },
    @Args('signInInput') signInInput: SignInInput,
  ) {
    // установить в куки
    const { req, res } = context;
    const cookies = cookieFactory(res, req);
    const { accessToken, refreshToken } =
      await this.authService.login(signInInput);

    cookies.remove('access_token');
    cookies.remove('refresh_token');

    cookies.set('access_token', accessToken, 1000 * 60 * 60 * 24);
    cookies.set('refresh_token', refreshToken, 1000 * 60 * 60 * 24 * 30);

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

    return { message: 'Successfully Logout' };
  }

  @UseGuards(AccessTokenGuard)
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
