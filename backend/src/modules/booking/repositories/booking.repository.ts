import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class BookingRepository {
  constructor(private prisma: PrismaService) {}

  async findSessionWithCourse(sessionId: string) {
    return this.prisma.courseSession.findUnique({
      where: { id: sessionId },
      include: { course: true },
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
                  include: { user: { select: { email: true, name: true } } },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOrderWithDetails(orderId: string) {
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

  async createOrderWithItems(data: {
    id: string;
    userId: string;
    totalAmount: Prisma.Decimal | number;
    status: OrderStatus;
    sessionId: string;
  }) {
    return this.prisma.order.create({
      data: {
        id: data.id,
        userId: data.userId,
        totalAmount: data.totalAmount,
        status: data.status,
        items: {
          create: {
            sessionId: data.sessionId,
            price: data.totalAmount,
          },
        },
      },
    });
  }

  async updateSessionBookedCount(
    sessionId: string,
    currentVersion: number,
    maxCapacity: number,
  ) {
    return this.prisma.courseSession.updateMany({
      where: {
        id: sessionId,
        version: currentVersion,
        bookedCount: { lt: maxCapacity },
      },
      data: {
        bookedCount: { increment: 1 },
        version: { increment: 1 },
      },
    });
  }
}
