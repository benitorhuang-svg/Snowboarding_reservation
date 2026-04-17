import { Global, Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma/prisma.module';
import { RedisService } from './redis/redis.service';
import { GcsService } from './storage/gcs.service';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [RedisService, GcsService],
  exports: [PrismaModule, RedisService, GcsService],
})
export class InfrastructureModule {}
