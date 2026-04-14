import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    courseId: string;
    coachId: string;
    startTime: Date;
    endTime: Date;
    capacity: number;
  }) {
    return this.prisma.courseSession.create({
      data: {
        courseId: data.courseId,
        coachId: data.coachId,
        startTime: data.startTime,
        endTime: data.endTime,
        capacity: data.capacity,
      },
    });
  }

  async findAvailable(courseId: string) {
    return this.prisma.courseSession.findMany({
      where: {
        courseId,
        status: 'OPEN',
        startTime: { gte: new Date() },
      },
    });
  }
}
