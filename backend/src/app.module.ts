import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CourseModule } from './modules/course/course.module';
import { BookingModule } from './modules/booking/booking.module';
import { PaymentModule } from './modules/payment/payment.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { I18nModule } from './modules/i18n/i18n.module';
import { PrismaModule } from './core/database/prisma/prisma.module';
import { RedisModule } from './core/redis/redis.module';
import { GcsService } from './core/storage/gcs.service';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    RedisModule,
    PrismaModule,
    AuthModule,
    CourseModule,
    BookingModule,
    PaymentModule,
    InvoiceModule,
    I18nModule,
  ],
  controllers: [AppController],
  providers: [AppService, GcsService],
})
export class AppModule {}
