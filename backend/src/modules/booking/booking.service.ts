import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { RedisService } from '../../core/redis/redis.service';
import { BookingRepository } from './repositories/booking.repository';
import { PrismaService } from '../../core/database/prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(
    private repository: BookingRepository,
    private redisClient: RedisService,
    private prisma: PrismaService, // Keep for transactions if repository doesn't wrap them yet
  ) {}

  async createBooking(userId: string, sessionId: string) {
    const lockKey = 'lock:session:' + sessionId;
    const lockValue = Date.now().toString();

    const acquired = await this.redisClient.set(lockKey, lockValue, 'EX', 5, 'NX');
    if (!acquired) {
      throw new ConflictException('預約繁忙中，請稍後再試');
    }

    try {
      // Use repository for single lookups
      const session = await this.repository.findSessionWithCourse(sessionId);
      if (!session) throw new NotFoundException('找不到該課程時段');
      if (session.bookedCount >= session.capacity) {
        throw new BadRequestException('名額已滿');
      }

      return await this.prisma.$transaction(async (tx) => {
        // Optimistic locking via repository logic (can be further moved to repo with tx pass-in)
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

        await this.redisClient.set('order:pending:' + orderId, sessionId, 'EX', 600);

        return order;
      });
    } finally {
      const currentLockValue = await this.redisClient.get(lockKey);
      if (currentLockValue === lockValue) {
        await this.redisClient.del(lockKey);
      }
    }
  }

  async getOrder(orderId: string) {
    return this.repository.findOrderWithDetails(orderId);
  }

  async findUserBookings(userId: string) {
    return this.repository.findUserBookings(userId);
  }
}
