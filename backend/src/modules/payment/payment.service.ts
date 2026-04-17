import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderStatusValidator } from '../../common/validators/order-status.validator';
import * as crypto from 'crypto';
import { BusinessException } from '../../common/filters/business-exception.filter';
import {
  TapPayResponse,
  LinePayResponse,
  WebhookData,
} from './interfaces/payment.interface';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async payByPrime(orderId: string, prime: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });
    if (!order)
      throw new BusinessException('訂單不存在', 'PAY_001', HttpStatus.BAD_REQUEST);

    // Validate transition
    OrderStatusValidator.validate(order.status, OrderStatus.PAID);

    // 1. Call TapPay Pay-by-Prime API
    const response = await this.callTapPayApi({
      prime,
      partner_key: process.env.TAPPAY_PARTNER_KEY,
      merchant_id: process.env.TAPPAY_MERCHANT_ID,
      details: 'Snowboarding Course - ' + orderId,
      amount: order.totalAmount.toNumber(),
      cardholder: {
        phone_number: order.user.mobilePhone || '0900000000',
        name: 'Guest',
        email: order.user.email,
      },
      remember: false,
    });

    if (response.status === 0) {
      // 2. Payment Success: Update Order
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.PAID,
          tappayRecTradeId: response.rec_trade_id,
          paymentMethod: 'CREDIT_CARD',
        },
      });

      // 3. Emit event for Invoicing
      this.eventEmitter.emit('order.paid', { orderId });

      return {
        status: 'SUCCESS',
        rec_trade_id: response.rec_trade_id,
      };
    } else {
      this.logger.error('TapPay Payment Failed: ' + response.msg);
      throw new BusinessException(
        '付款失敗: ' + response.msg,
        'PAY_002',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async callTapPayApi(data: unknown): Promise<TapPayResponse> {
    const isSandbox = process.env.NODE_ENV !== 'production';
    const url = isSandbox
      ? 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime'
      : 'https://spgateway.tappaysdk.com/tpc/payment/pay-by-prime';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.TAPPAY_PARTNER_KEY || '',
      },
      body: JSON.stringify(data),
    });

    return (await response.json()) as TapPayResponse;
  }

  async handleWebhook(data: WebhookData, signature?: string) {
    // Handle asynchronous payment status updates from TapPay
    this.logger.log('Received TapPay Webhook:', data);

    // 1. HMAC Signature / Basic Validation (B2)
    const partnerKey = process.env.TAPPAY_PARTNER_KEY || '';
    if (signature) {
      const expectedMac = crypto
        .createHmac('sha256', partnerKey)
        .update(JSON.stringify(data))
        .digest('hex');
      if (signature !== expectedMac) {
        this.logger.error('Invalid Webhook HMAC Signature');
        return { status: -1, msg: 'Invalid signature' };
      }
    }

    if (!data || !data.rec_trade_id || !data.order_id) {
      this.logger.error('Invalid Webhook data received');
      return { status: -1, msg: 'Invalid data' };
    }

    const { order_id, rec_trade_id, status } = data;

    // 2. Idempotency & Order Retrieval
    const order = await this.prisma.order.findUnique({
      where: { id: order_id },
    });

    if (!order) {
      this.logger.error('Webhook Order Not Found: ' + order_id);
      return { status: -1, msg: 'Order not found' };
    }

    // 3. Check if already processed
    if (order.status === OrderStatus.PAID) {
      this.logger.log('Order ' + order_id + ' already marked as PAID.');
      return { status: 0, msg: 'Already processed' };
    }

    // 4. Update Status if Successful
    if (status === 0) {
      // Validate transition
      OrderStatusValidator.validate(order.status, OrderStatus.PAID);

      await this.prisma.order.update({
        where: { id: order_id },
        data: {
          status: OrderStatus.PAID,
          tappayRecTradeId: rec_trade_id,
          paymentMethod: 'CREDIT_CARD_WEBHOOK',
        },
      });

      this.eventEmitter.emit('order.paid', { orderId: order_id });
      this.logger.log('Order ' + order_id + ' successfully PAID via Webhook.');
    } else {
      this.logger.warn('Webhook Payment Failed for ' + order_id + ': status ' + status);
    }

    return { status: 0, msg: 'OK' };
  }

  async refundOrder(orderId: string, amount?: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { session: true } } },
    });

    if (!order)
      throw new BusinessException('Order not found', 'PAY_003', HttpStatus.BAD_REQUEST);
    if (order.status !== OrderStatus.PAID && order.status !== OrderStatus.COMPLETED) {
      throw new BusinessException(
        'Only PAID or COMPLETED orders can be refunded',
        'PAY_004',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 1. Calculate Refundable Amount based on Rules (B8)
    const now = new Date();
    let maxRefundPercent = 1.0;

    const earliestSessionStart = order.items.reduce((earliest, item) => {
      return item.session.startTime < earliest ? item.session.startTime : earliest;
    }, order.items[0].session.startTime);

    const diffMs = earliestSessionStart.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 48) {
      maxRefundPercent = 0;
    } else if (diffHours < 168) {
      maxRefundPercent = 0.5;
    } else {
      maxRefundPercent = 1.0;
    }

    const refundableAmount = order.totalAmount.toNumber() * maxRefundPercent;
    const finalRefundAmount =
      amount !== undefined ? Math.min(amount, refundableAmount) : refundableAmount;

    if (finalRefundAmount <= 0) {
      throw new BusinessException(
        'This order is not eligible for refund based on time rules',
        'PAY_005',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 2. Call TapPay Refund API
    const refundData = {
      partner_key: process.env.TAPPAY_PARTNER_KEY,
      rec_trade_id: order.tappayRecTradeId,
      amount: finalRefundAmount,
    };

    const isSandbox = process.env.NODE_ENV !== 'production';
    const url = isSandbox
      ? 'https://sandbox.tappaysdk.com/tpc/payment/refund'
      : 'https://spgateway.tappaysdk.com/tpc/payment/refund';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.TAPPAY_PARTNER_KEY || '',
      },
      body: JSON.stringify(refundData),
    });

    const result = (await response.json()) as TapPayResponse;
    if (result.status === 0) {
      OrderStatusValidator.validate(order.status, OrderStatus.REFUNDED);
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.REFUNDED,
        },
      });

      this.eventEmitter.emit('order.refunded', {
        orderId,
        amount: finalRefundAmount,
      });

      return { status: 'SUCCESS', refundedAmount: finalRefundAmount };
    } else {
      this.logger.error('TapPay Refund Failed: ' + result.msg);
      throw new BusinessException(
        '退款失敗: ' + result.msg,
        'PAY_006',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async payByApplePay(orderId: string, paymentToken: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order)
      throw new BusinessException('Order not found', 'PAY_001', HttpStatus.BAD_REQUEST);

    const url = 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.TAPPAY_PARTNER_KEY || '',
        },
        body: JSON.stringify({
          prime: paymentToken,
          partner_key: process.env.TAPPAY_PARTNER_KEY,
          merchant_id: process.env.TAPPAY_MERCHANT_ID,
          amount: order.totalAmount.toNumber(),
          details: 'Apple Pay - ' + orderId,
        }),
      });
      const data = (await response.json()) as TapPayResponse;

      if (data.status === 0) {
        OrderStatusValidator.validate(order.status, OrderStatus.PAID);
        await this.prisma.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.PAID, paymentMethod: 'APPLE_PAY' },
        });
      } else {
        throw new BusinessException(
          'Apple Pay transaction failed: ' + data.msg,
          'PAY_007',
          HttpStatus.BAD_REQUEST,
        );
      }
      return {
        status: 'SUCCESS',
        message: 'Apple Pay transaction executed',
        orderId,
      };
    } catch (e) {
      this.logger.error('Apple Pay failed: ' + (e instanceof Error ? e.message : e));
      if (e instanceof BusinessException) throw e;
      throw new BusinessException('Apple Pay failed', 'PAY_007', HttpStatus.BAD_REQUEST);
    }
  }

  async payByGooglePay(orderId: string, paymentToken: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order)
      throw new BusinessException('Order not found', 'PAY_001', HttpStatus.BAD_REQUEST);

    const url = 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.TAPPAY_PARTNER_KEY || '',
        },
        body: JSON.stringify({
          prime: paymentToken,
          partner_key: process.env.TAPPAY_PARTNER_KEY,
          merchant_id: process.env.TAPPAY_MERCHANT_ID,
          amount: order.totalAmount.toNumber(),
          details: 'Google Pay - ' + orderId,
        }),
      });
      const data = (await response.json()) as TapPayResponse;

      if (data.status === 0) {
        OrderStatusValidator.validate(order.status, OrderStatus.PAID);
        await this.prisma.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.PAID, paymentMethod: 'GOOGLE_PAY' },
        });
      } else {
        throw new BusinessException(
          'Google Pay transaction failed: ' + data.msg,
          'PAY_008',
          HttpStatus.BAD_REQUEST,
        );
      }
      return {
        status: 'SUCCESS',
        message: 'Google Pay transaction executed',
        orderId,
      };
    } catch (e) {
      this.logger.error('Google Pay failed: ' + (e instanceof Error ? e.message : e));
      if (e instanceof BusinessException) throw e;
      throw new BusinessException('Google Pay failed', 'PAY_008', HttpStatus.BAD_REQUEST);
    }
  }

  async payByLinePay(orderId: string, returnUrl: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order)
      throw new BusinessException('Order not found', 'PAY_001', HttpStatus.BAD_REQUEST);

    const channelId = process.env.LINE_PAY_CHANNEL_ID || 'mock';
    const url = 'https://sandbox-api-pay.line.me/v3/payments/request';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-LINE-ChannelId': channelId,
        },
        body: JSON.stringify({
          amount: order.totalAmount.toNumber(),
          currency: 'TWD',
          orderId: order.id,
          packages: [
            {
              id: 'pkg_1',
              amount: order.totalAmount.toNumber(),
              name: 'Snowboarding Course',
              products: [
                {
                  name: 'Course',
                  quantity: 1,
                  price: order.totalAmount.toNumber(),
                },
              ],
            },
          ],
          redirectUrls: { confirmUrl: returnUrl, cancelUrl: returnUrl },
        }),
      });
      const data = (await response.json()) as LinePayResponse;

      if (data.returnCode === '0000') {
        return {
          status: 'SUCCESS',
          paymentUrl: data.info.paymentUrl.web,
          orderId,
        };
      } else {
        throw new BusinessException(
          'LINE Pay API Error: ' + data.returnMessage,
          'PAY_009',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (e) {
      this.logger.error('LINE Pay failed: ' + (e instanceof Error ? e.message : e));
      if (e instanceof BusinessException) throw e;
      throw new BusinessException('LINE Pay failed', 'PAY_009', HttpStatus.BAD_REQUEST);
    }
  }
}
