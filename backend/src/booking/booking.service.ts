import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import Redis from 'ioredis';

@Injectable()
export class BookingService {
  private redisClient: Redis;

  constructor(private prisma: PrismaService) {
    this.redisClient = new Redis(
      process.env.REDIS_URL || 'redis://localhost:6379',
    );
  }

  async createBooking(userId: string, sessionId: string) {
    const lockKey = `lock:session:${sessionId}`;
    const lockValue = Date.now().toString();

    const acquired = await this.redisClient.set(
      lockKey,
      lockValue,
      'PX',
      10000,
      'NX',
    );
    if (!acquired) {
      throw new ConflictException('目前系統繁忙，請稍後再試 (Lock Failed)');
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const session = await tx.courseSession.findUnique({
          where: { id: sessionId },
        });

        if (!session) throw new NotFoundException('Session not found');
        if (session.bookedCount >= session.capacity) {
          throw new BadRequestException('Session is full');
        }

        const updateResult = await tx.courseSession.updateMany({
          where: {
            id: sessionId,
            version: session.version,
          },
          data: {
            bookedCount: { increment: 1 },
            version: { increment: 1 },
          },
        });

        if (updateResult.count === 0) {
          throw new ConflictException('Concurrency conflict, please try again');
        }

        const order = await tx.order.create({
          data: {
            userId,
            totalAmount: 1500,
            status: 'PENDING',
            items: {
              create: {
                sessionId: sessionId,
                price: 1500,
              },
            },
          },
        });

        return order;
      });
    } finally {
      const currentLockValue = await this.redisClient.get(lockKey);
      if (currentLockValue === lockValue) {
        await this.redisClient.del(lockKey);
      }
    }
  }
}
