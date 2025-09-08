import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { GenerateAtUseCase } from '@auth/application/use-cases/generate-at.usecase';
import { GenerateRtUseCase } from '@auth/application/use-cases/generate-rt.usecase';
import { ConfigService } from '@nestjs/config';
import { convertToSecondsUtil } from '@common/utils/convert-to-seconds.util';
import { addMilliseconds } from 'date-fns';
import { EncryptionService } from '@hashing/application/encryption.service';
import { RefreshM } from '@auth/domain/refresh';

@Injectable()
export class AuthService {
  constructor(
    private readonly refreshRepo: RefreshRepository,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async register(input: CreateUserInput): Promise<UserM> {
    return this.commandBus.execute(new RegisterUserCommand(input));
  }

  async login(input: SignInInput): Promise<TokensM> {
    const exists = await this.queryBus.execute(
      new GetUserByEmailQuery(input.email),
    );
    if (!exists) {
      throw new UnauthorizedException('Email Or Password Not Valid');
    }

    const isValidPassword = await this.commandBus.execute(
      new CheckPasswordCommand(exists, input.password),
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Email Or Password Not Valid');
    }

    // генерация акцес токена
    const generateAtUseCase = new GenerateAtUseCase(this.jwtService);
    const accessToken = await generateAtUseCase.execute({
      sub: exists.id,
      email: exists.email,
    });

    // генерация рефреш токена
    const stringExp = this.configService.get<string>('RT_EXPIRES_IN');
    const exp = convertToSecondsUtil(stringExp);
    const expiresAt = addMilliseconds(new Date(), exp);
    const generateRtUseCase = new GenerateRtUseCase(this.jwtService);
    const refreshToken = await generateRtUseCase.execute(exists.id, expiresAt);

    // хэширование рефреш токена
    const tokenHash = await this.encryptionService.hashPassword(refreshToken);

    // сохранение в бд
    await this.refreshRepo.save({
      userId: exists.id,
      expiresAt,
      tokenHash,
    });

    // возвращение акцес и рефреш
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refresh: string): Promise<TokensM> {
    const decodeRefresh = await this.jwtService.decode(refresh);
    if (!decodeRefresh) {
      throw new UnauthorizedException('Not Valid Refresh Token');
    }

    return {
      accessToken: '1234',
      refreshToken: '2342',
    };
  }

  async logout(refresh: string) {
    const decodeRefresh = await this.jwtService.decode(refresh);
    if (!decodeRefresh) {
      throw new UnauthorizedException('Not Valid Refresh Token');
    }

    const exists: RefreshM = await this.refreshRepo.get(decodeRefresh.userId);
    const deleted = await this.refreshRepo.remove(exists.id);

    return !!deleted;
  }

  async me(access: string): Promise<UserM> {
    const decodeAccess = await this.jwtService.decode(access);

    const exists = await this.queryBus.execute(
      new GetUserByEmailQuery(decodeAccess.email),
    );
    if (!exists) {
      throw new NotFoundException('User Not Found');
    }

    return exists;
  }
}
