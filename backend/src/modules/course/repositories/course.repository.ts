import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CourseRepository {
  constructor(private prisma: PrismaService) {}

  async findMany(
    where: Prisma.CourseWhereInput,
    skip: number,
    take: number,
    orderBy: Prisma.CourseOrderByWithRelationInput,
  ) {
    return this.prisma.course.findMany({ where, skip, take, orderBy });
  }

  async count(where: Prisma.CourseWhereInput) {
    return this.prisma.course.count({ where });
  }

  async createCourse(data: Prisma.CourseCreateInput) {
    return this.prisma.course.create({ data });
  }

  async findSessions(where: Prisma.CourseSessionWhereInput) {
    return this.prisma.courseSession.findMany({
      where,
      include: {
        course: true,
        coach: { include: { user: { select: { email: true, name: true } } } },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async findFirstSession(where: Prisma.CourseSessionWhereInput) {
    return this.prisma.courseSession.findFirst({ where });
  }

  async createSession(data: Prisma.CourseSessionUncheckedCreateInput) {
    return this.prisma.courseSession.create({ data });
  }

  async createManySessions(data: Prisma.CourseSessionCreateManyInput[]) {
    return this.prisma.courseSession.createMany({
      data,
      skipDuplicates: true,
    });
  }
}
