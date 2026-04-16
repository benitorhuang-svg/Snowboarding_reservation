import { CourseType } from '@prisma/client';

export class CreateCourseDto {
  title: object;
  description: object;
  type: CourseType;
  basePrice: number;
}

export class CreateSessionDto {
  courseId: string;
  coachId: string;
  startTime: string;
  endTime: string;
  capacity: number;
  locationId: string;
}

export class BulkGenerateDto {
  coachId: string;
  courseId: string;
  dates: string[];
  timeSlots: { start: string; end: string }[];
  capacity: number;
  locationId: string;
}
