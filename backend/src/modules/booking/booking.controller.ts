import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { BookingService } from './booking.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';

interface RequestWithJwtUser {
  user: {
    sub: string;
    email: string;
    role: string;
  };
}

@ApiTags('Booking (高併發預約引擎)')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '建立預約 (附帶樂觀鎖並行控制)' })
  async createBooking(
    @Request() req: RequestWithJwtUser,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<unknown> {
    // req.user 來自 JWT 解碼
    const userId = req.user.sub;
    return this.bookingService.createBooking(userId, createBookingDto.sessionId);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '取得用戶所有預約訂單' })
  async findUserBookings(@Request() req: RequestWithJwtUser): Promise<unknown> {
    const userId = req.user.sub;
    return this.bookingService.findUserBookings(userId);
  }
}
