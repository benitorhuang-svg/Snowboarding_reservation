import { Controller, Get, Post, Body } from '@nestjs/common';
import { CourseService } from './course.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsString, IsObject, IsNumber, IsEnum } from 'class-validator';
import { CourseType } from '@prisma/client';

export class CreateCourseDto {
  @IsObject()
  title: Record<string, string>;

  @IsObject()
  description: Record<string, string>;

  @IsEnum(CourseType)
  type: CourseType;

  @IsNumber()
  basePrice: number;
}

@ApiTags('Courses (課程管理)')
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ApiOperation({ summary: '建立新課程 (多語系支援)' })
  @ApiResponse({ status: 201, description: '課程建立成功' })
  async create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: '取得所有課程列表' })
  async findAll() {
    return this.courseService.findAll();
  }
}
