import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { OrderStatusValidator } from '../../common/validators/order-status.validator';

interface OrderItem {
  sessionId: string;
}

interface OrderWithItems {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
}

@Injectable()
export class BookingCleanupService {
  private readonly logger = new Logger(BookingCleanupService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Cleanup expired pending bookings every minute.
   * If a booking is PENDING for more than 10 minutes, cancel it and release spots.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredBookings() {
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() - 10);

    const expiredOrders = (await this.prisma.order.findMany({
      where: {
        status: OrderStatus.PENDING_PAYMENT,
        createdAt: { lt: expirationTime },
      },
      include: { items: true },
    })) as unknown as OrderWithItems[];

    if (expiredOrders.length === 0) return;

    this.logger.log(`Found ${expiredOrders.length} expired orders. Cleaning up...`);

    for (const order of expiredOrders) {
      try {
        await this.prisma.$transaction(async (tx) => {
          OrderStatusValidator.validate(order.status, OrderStatus.CANCELLED);
          await tx.order.update({
            where: { id: order.id },
            data: { status: OrderStatus.CANCELLED },
          });

          for (const item of order.items) {
            await tx.courseSession.update({
              where: { id: item.sessionId },
              data: {
                bookedCount: { decrement: 1 },
                version: { increment: 1 },
              },
            });
          }
        });
        this.logger.log(`Successfully cancelled order ${order.id} and released spots.`);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown';
        this.logger.error(`Failed to cleanup order ${order.id}: ${message}`);
      }
    }
  }
}
