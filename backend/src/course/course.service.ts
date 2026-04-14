import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: any;
    description: any;
    type: any;
    basePrice: number;
  }) {
    return this.prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        basePrice: data.basePrice,
      },
    });
  }

  async findAll() {
    return this.prisma.course.findMany();
  }
}
