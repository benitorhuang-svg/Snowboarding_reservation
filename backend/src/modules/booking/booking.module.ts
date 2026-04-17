import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingCleanupService } from './tasks/booking-cleanup.task';
import { BookingRepository } from './repositories/booking.repository';

@Module({
  imports: [],
  controllers: [BookingController],
  providers: [BookingService, BookingCleanupService, BookingRepository],
  exports: [BookingService, BookingRepository],
})
export class BookingModule {}
