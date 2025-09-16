import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { RefreshRepository } from '@auth/domain/refresh.repository';
import { CreateUserInput } from '@user/infrastructure/presentation/dto/create-user.input';
import { RegisterUserCommand } from '@user/domain/commands/register-user.command';
import { UserM } from '@user/domain/user';
import { SignInInput } from '@auth/infrastructure/persistence/dto/sign-in.input';
import { TokensM } from '@auth/domain/tokens';
import { GetUserByEmailQuery } from '@user/domain/queries/get-user-by-email.query';
import { CheckPasswordCommand } from '@user/domain/commands/check-password.command';
import { convertToMiliSecondsUtil } from '@common/utils/convert-to-mili-seconds.util';
import { addMilliseconds } from 'date-fns';
import { EncryptionService } from '@hashing/application/encryption.service';
import { GetUserByIdQuery } from '@user/domain/queries/get-user-by-id.query';
import { UserPayload } from '@common/interfaces/user.payload';
import { RefreshTokenPayload } from '@common/interfaces/refresh-token.payload';
import { config } from '@common/config/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly refreshRepo: RefreshRepository,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async register(input: CreateUserInput): Promise<UserM> {
    return this.commandBus.execute(new RegisterUserCommand(input));
  }

  async login(input: SignInInput): Promise<TokensM> {
    const user = await this.queryBus.execute(
      new GetUserByEmailQuery(input.email),
    );
    if (!user) {
      throw new UnauthorizedException('Email Or Password Not Valid');
    }

    const isValidPassword = await this.commandBus.execute(
      new CheckPasswordCommand(user, input.password),
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Email Or Password Not Valid');
    }

    return this.issuingTokens(user);
  }

  async refreshTokens(userId: number, oldRefresh: string): Promise<TokensM> {
    const storedToken = await this.refreshRepo.get(userId);
    if (!storedToken) {
      throw new UnauthorizedException('No Refresh Token Found');
    }
    const isVerifyTokens = await this.encryptionService.verifyPassword(
      oldRefresh,
      storedToken.tokenHash,
    );
    if (!isVerifyTokens) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const user = await this.queryBus.execute(new GetUserByIdQuery(userId));

    return this.issuingTokens(user);
  }

  async logout(userId: number) {
    const exists = await this.refreshRepo.get(userId);
    const deleted = await this.refreshRepo.remove(exists.id);

    return !!deleted;
  }

  async me(userId: number): Promise<UserM> {
    const user = await this.queryBus.execute(new GetUserByIdQuery(userId));

    return user;
  }

  private getRtExp(): Date {
    const exp = convertToMiliSecondsUtil(config().rt_exp);
    const expiresAt = addMilliseconds(new Date(), exp);
    return expiresAt;
  }

  private async generateAt(userPayload: UserPayload): Promise<string> {
    const accessToken = await this.jwtService.signAsync(userPayload);
    return accessToken;
  }

  private async generateRt(
    refreshTokenPayload: RefreshTokenPayload,
  ): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      secret: config().rt_secret,
      expiresIn: config().rt_exp,
    });
    return refreshToken;
  }

  private async issuingTokens(user: UserM): Promise<TokensM> {
    const accessToken = await this.generateAt({
      sub: user.id,
      email: user.email,
    });

    const expiresAt = this.getRtExp();

    const refreshToken = await this.generateRt({ userId: user.id, expiresAt });

    const tokenHash = await this.encryptionService.hashPassword(refreshToken);
    await this.refreshRepo.save({
      expiresAt,
      tokenHash,
      userId: user.id,
    });

    return { accessToken, refreshToken };
  }
}
