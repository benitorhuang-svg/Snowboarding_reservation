import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCourseDto, CreateSessionDto, BulkGenerateDto } from './dto/course.dto';

@ApiTags('Courses')
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @ApiOperation({ summary: '取得課程列表' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('q') q?: string,
    @Query('sort_by') sortBy?: string,
  ): Promise<unknown> {
    return this.courseService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      q,
      sortBy,
    );
  }

  @Post()
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '建立課程 (僅限 Admin)' })
  async create(@Body() createCourseDto: CreateCourseDto): Promise<unknown> {
    return this.courseService.createCourse(createCourseDto);
  }

  @Get('sessions')
  @ApiOperation({ summary: '查詢時段' })
  async findSessions(
    @Query('courseId') courseId?: string,
    @Query('coachId') coachId?: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('q') q?: string,
  ) {
    return this.courseService.findSessions({
      courseId,
      coachId,
      start,
      end,
      q,
    });
  }

  @Post('sessions')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COACH')
  @ApiBearerAuth()
  @ApiOperation({ summary: '教練開課 (教練或 Admin)' })
  async createSession(@Body() createSessionDto: CreateSessionDto): Promise<unknown> {
    return this.courseService.createSession({
      ...createSessionDto,
      startTime: new Date(createSessionDto.startTime),
      endTime: new Date(createSessionDto.endTime),
    });
  }

  @Delete('sessions/:id')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COACH')
  @ApiBearerAuth()
  @ApiOperation({ summary: '刪除時段' })
  async deleteSession(@Param('id') id: string) {
    // Basic implementation placeholder
    await new Promise((resolve) => setTimeout(resolve, 50));
    return { success: true, id };
  }

  @Post('bulk-generate')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COACH')
  @ApiBearerAuth()
  @ApiOperation({ summary: '大量產生時段' })
  async generateSessions(@Body() bulkDto: BulkGenerateDto): Promise<unknown> {
    return this.courseService.bulkGenerateSlots(bulkDto);
  }
}
