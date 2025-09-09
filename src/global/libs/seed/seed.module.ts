import { Module } from '@nestjs/common';
import { SeedService } from './application/seed.service';

@Module({
  providers: [SeedService],
})
export class SeedModule {}
