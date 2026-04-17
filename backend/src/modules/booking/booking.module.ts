import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingCleanupService } from './tasks/booking-cleanup.task';
import { PrismaModule } from '../../core/database/prisma/prisma.module';
import { RedisModule } from '../../core/redis/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [BookingController],
  providers: [BookingService, BookingCleanupService],
  exports: [BookingService],
})
export class BookingModule {}
