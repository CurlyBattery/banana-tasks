import { Mutation, Resolver, Args, Context, Query } from '@nestjs/graphql';
import { Request, Response } from 'express';

import { CreateUserInput } from '@user/infrastructure/presentation/dto/create-user.input';
import { AuthService } from '@auth/application/auth.service';
import { SignInInput } from '@auth/infrastructure/persistence/dto/sign-in.input';
import { cookieFactory } from '../../../../global/libs/auth/cookie.lib';
import { BadRequestException } from '@nestjs/common';

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

    cookies.set('access_token', accessToken, 1000 * 60 * 60);
    cookies.set('refresh_token', refreshToken, 1000 * 60 * 60 * 24 * 30);

    return { accessToken, refreshToken };
  }

  @Mutation('refresh')
  async refreshTokens(@Context() context: { req: Request; res: Response }) {
    const { req, res } = context;
    console.log(req);
    const cookies = cookieFactory(res, req);

    const refresh = cookies.get('refresh_token');
    console.log(refresh);

    const { accessToken, refreshToken } =
      await this.authService.refreshTokens(refresh);

    return { accessToken, refreshToken };
  }

  @Query('logout')
  async logout(@Context() context: { req: Request; res: Response }) {
    const { req, res } = context;
    const cookies = cookieFactory(res, req);

    const refresh = cookies.get('refresh_token');
    console.log(refresh);

    const isDeleted = await this.authService.logout(refresh);
    if (!isDeleted) {
      throw new BadRequestException('Error Delete Refresh');
    }

    cookies.remove('access_token');
    cookies.remove('refresh_token');

    return { message: 'Successfully Logout' };
  }

  @Query('me')
  async getAuthenticateUser(
    @Context() context: { req: Request; res: Response },
  ) {
    const { req, res } = context;
    const cookies = cookieFactory(res, req);

    const accessToken = cookies.get('access_token');

    return this.authService.me(accessToken);
  }
}
