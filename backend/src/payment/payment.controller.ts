import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IsUUID, IsString } from 'class-validator';

export class PayByPrimeDto {
  @IsUUID()
  orderId: string;

  @IsString()
  prime: string;
}

@ApiTags('Payment (金流串接)')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('pay-by-prime')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tappay Prime 刷卡授權' })
  async payByPrime(@Body() payDto: PayByPrimeDto) {
    return this.paymentService.payByPrime(payDto.orderId, payDto.prime);
  }
}
