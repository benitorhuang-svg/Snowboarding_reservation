import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SessionService } from './session.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsInt, Min } from 'class-validator';

export class CreateSessionDto {
  @IsUUID()
  courseId: string;

  @IsUUID()
  coachId: string;

  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;

  @IsInt()
  @Min(1)
  capacity: number;
}

@ApiTags('Sessions (課程時段)')
@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @ApiOperation({ summary: '教練新增可預約時段' })
  async create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.create(createSessionDto);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: '查詢特定課程的可用時段 (餘位大於 0)' })
  async findAvailable(@Param('courseId') courseId: string) {
    return this.sessionService.findAvailable(courseId);
  }
}
