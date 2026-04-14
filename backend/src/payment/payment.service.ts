import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async payByPrime(orderId: string, prime: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new BadRequestException('Order not found');

    // 呼叫 Tappay
    const tappayResponse = await this.mockTappayPay(
      prime,
      order.totalAmount.toNumber(),
    );

    if (tappayResponse.status === 0) {
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          tappayRecTradeId: tappayResponse.rec_trade_id,
        },
      });

      // 觸發事件驅動發票開立 (Event Emitter)
      this.eventEmitter.emit('order.paid', { orderId: orderId });

      return { success: true, message: 'Payment successful' };
    } else {
      throw new BadRequestException('Payment failed via Tappay');
    }
  }

  private mockTappayPay(prime: string, amount: number): Promise<any> {
    return Promise.resolve({
      status: 0,
      rec_trade_id:
        'REC_' + Math.random().toString(36).substring(2, 11).toUpperCase(),
    });
  }
}
