import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { BookingService } from './booking.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  sessionId: string;
}

@ApiTags('Booking (高併發預約引擎)')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '建立預約 (附帶樂觀鎖並行控制)' })
  async createBooking(
    @Request() req: any,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    // req.user 來自 JWT 解碼
    const userId = req.user.sub;
    return this.bookingService.createBooking(
      userId,
      createBookingDto.sessionId,
    );
  }
}
