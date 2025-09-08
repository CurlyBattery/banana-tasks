import { JwtService } from '@nestjs/jwt';

export class GenerateRtUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(userId: number, expiresAt: Date) {
    const userRefreshPayload = { userId, expiresAt };
    const refreshToken = await this.jwtService.signAsync(userRefreshPayload);
    return refreshToken;
  }
}
