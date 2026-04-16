import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { RedisService } from '../../core/redis/redis.service';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private redisClient: RedisService,
  ) {}

  async createBooking(userId: string, sessionId: string) {
    // 1. Distributed Lock to prevent massive hits on same session
    const lockKey = 'lock:session:' + sessionId;
    const lockValue = Date.now().toString();

    // Acquire lock for 5 seconds
    const acquired = await this.redisClient.set(lockKey, lockValue, 'EX', 5, 'NX');
    if (!acquired) {
      throw new ConflictException('預約繁忙中，請稍後再試');
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        // 2. Verify Session and Course Price
        const session = await tx.courseSession.findUnique({
          where: { id: sessionId },
          include: { course: true },
        });

        if (!session) throw new NotFoundException('找不到該課程時段');
        if (session.bookedCount >= session.capacity) {
          throw new BadRequestException('名額已滿');
        }

        // 3. Optimistic Locking using version field
        const updateResult = await tx.courseSession.updateMany({
          where: {
            id: sessionId,
            version: session.version,
            bookedCount: { lt: session.capacity },
          },
          data: {
            bookedCount: { increment: 1 },
            version: { increment: 1 },
          },
        });

        if (updateResult.count === 0) {
          throw new ConflictException('預約衝突，請重試');
        }

        // 4. Create Order with YYYYMMDD style ID
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
        const orderId = dateStr + randomStr;

        const order = await tx.order.create({
          data: {
            id: orderId,
            userId,
            totalAmount: session.course.basePrice,
            status: OrderStatus.PENDING_PAYMENT,
            items: {
              create: {
                sessionId: sessionId,
                price: session.course.basePrice,
              },
            },
          },
        });

        // 5. Implement TTL in Redis for this order to auto-release stock if not paid in 10 mins
        await this.redisClient.set(
          'order:pending:' + orderId,
          sessionId,
          'EX',
          600, // 10 minutes in seconds
        );

        return order;
      });
    } finally {
      // Release lock safely
      const currentLockValue = await this.redisClient.get(lockKey);
      if (currentLockValue === lockValue) {
        await this.redisClient.del(lockKey);
      }
    }
  }

  async getOrder(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            session: {
              include: { course: true, coach: { include: { user: true } } },
            },
          },
        },
      },
    });
  }

  async findUserBookings(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            session: {
              include: {
                course: true,
                coach: {
                  include: { user: { select: { email: true } } },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
