import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { CourseType, Prisma } from '@prisma/client';
import { BusinessException } from '../../common/filters/business-exception.filter';

export interface CourseWithTranslations {
  id: string;
  title: Prisma.JsonValue;
  description: Prisma.JsonValue;
  basePrice: Prisma.Decimal;
}

export interface SessionWithDetails {
  id: string;
  startTime: Date;
  capacity: number;
  bookedCount: number;
}

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 10, q?: string, sortBy?: string) {
    const skip = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = {};
    if (q) {
      where.OR = [
        { title: { path: '$.zh-tw', string_contains: q } },
        { title: { path: '$.en', string_contains: q } },
      ];
    }

    const orderBy: Prisma.CourseOrderByWithRelationInput = {};
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      if (field === 'basePrice') {
        orderBy[field] = order === 'desc' ? 'desc' : 'asc';
      }
    } else {
      orderBy.id = 'desc';
    }

    const [items, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      items: items as CourseWithTranslations[],
      total,
      page,
      limit,
    };
  }

  async createCourse(data: {
    title: object;
    description: object;
    type: CourseType;
    basePrice: number;
  }) {
    return this.prisma.course.create({
      data: {
        title: data.title as Prisma.InputJsonValue,
        description: data.description as Prisma.InputJsonValue,
        type: data.type,
        basePrice: data.basePrice,
      },
    });
  }

  async findSessions(query: {
    courseId?: string;
    coachId?: string;
    start?: string;
    end?: string;
    q?: string;
  }) {
    const where: Prisma.CourseSessionWhereInput = {};
    if (query.courseId) where.courseId = query.courseId;
    if (query.coachId) where.coachId = query.coachId;
    if (query.start || query.end) {
      where.startTime = {
        gte: query.start ? new Date(query.start) : undefined,
        lte: query.end ? new Date(query.end) : undefined,
      };
    }

    const items = await this.prisma.courseSession.findMany({
      where,
      include: {
        course: true,
        coach: { include: { user: { select: { email: true } } } },
      },
      orderBy: { startTime: 'asc' },
    });

    return items as (SessionWithDetails & { course: CourseWithTranslations })[];
  }

  async createSession(data: {
    courseId: string;
    coachId: string;
    startTime: Date;
    endTime: Date;
    capacity: number;
    locationId: string;
  }) {
    // Check for coach availability
    const conflict = await this.prisma.courseSession.findFirst({
      where: {
        coachId: data.coachId,
        OR: [
          {
            startTime: { lt: data.endTime },
            endTime: { gt: data.startTime },
          },
        ],
      },
    });

    if (conflict) {
      throw new BusinessException(
        'Coach has a schedule conflict',
        'COURSE_001',
        HttpStatus.CONFLICT,
      );
    }

    return this.prisma.courseSession.create({
      data: {
        courseId: data.courseId,
        coachId: data.coachId,
        startTime: data.startTime,
        endTime: data.endTime,
        capacity: data.capacity,
        locationId: data.locationId || 'Niseko',
      },
    });
  }

  /**
   * Bulk generate empty slots for a coach (Admin/Coach feature)
   */
  async bulkGenerateSlots(params: {
    coachId: string;
    courseId: string;
    dates: string[];
    timeSlots: { start: string; end: string }[];
    capacity: number;
    locationId: string;
  }) {
    const sessionsToCreate: Prisma.CourseSessionCreateManyInput[] = [];

    params.dates.forEach((date) => {
      params.timeSlots.forEach((slot) => {
        sessionsToCreate.push({
          courseId: params.courseId,
          coachId: params.coachId,
          startTime: new Date(`${date}T${slot.start}:00Z`),
          endTime: new Date(`${date}T${slot.end}:00Z`),
          capacity: params.capacity,
          locationId: params.locationId || 'Niseko',
        });
      });
    });

    if (sessionsToCreate.length > 0) {
      await this.prisma.courseSession.createMany({
        data: sessionsToCreate,
        skipDuplicates: true,
      });
    }

    return { generatedCount: sessionsToCreate.length };
  }
}
