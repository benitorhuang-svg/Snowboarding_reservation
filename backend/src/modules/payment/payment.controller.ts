import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

interface WebhookData {
  order_id: string;
  rec_trade_id: string;
  status: number;
}

@ApiTags('Payment')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('pay-by-prime')
  @ApiOperation({ summary: 'TapPay Prime ?��?' })
  async payByPrime(@Body() body: { orderId: string; prime: string }) {
    return this.paymentService.payByPrime(body.orderId, body.prime);
  }

  @Post('tappay-webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'TapPay Webhook ?�傳' })
  async handleTappayWebhook(
    @Body() data: WebhookData,
    @Headers('x-tappay-signature') signature?: string,
  ) {
    return this.paymentService.handleWebhook(data, signature);
  }

  @Post('apple-pay')
  @ApiOperation({ summary: 'Apple Pay ?��?' })
  async payByApplePay(@Body() body: { orderId: string; paymentToken: string }) {
    return this.paymentService.payByApplePay(body.orderId, body.paymentToken);
  }

  @Post('google-pay')
  @ApiOperation({ summary: 'Google Pay ?��?' })
  async payByGooglePay(@Body() body: { orderId: string; paymentToken: string }) {
    return this.paymentService.payByGooglePay(body.orderId, body.paymentToken);
  }

  @Post('line-pay')
  @ApiOperation({ summary: 'LINE Pay ?��?' })
  async payByLinePay(@Body() body: { orderId: string; returnUrl: string }) {
    return this.paymentService.payByLinePay(body.orderId, body.returnUrl);
  }
}
