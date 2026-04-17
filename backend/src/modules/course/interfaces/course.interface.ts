import { Prisma } from '@prisma/client';

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
