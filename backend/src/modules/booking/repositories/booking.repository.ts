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
}
