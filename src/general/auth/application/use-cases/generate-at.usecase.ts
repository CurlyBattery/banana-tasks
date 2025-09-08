import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '../../../../global/common/interfaces/user.payload';

export class GenerateAtUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(userPayload: UserPayload): Promise<string> {
    const accessToken = await this.jwtService.signAsync(userPayload);
    return accessToken;
  }
}
