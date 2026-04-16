import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { GcsService } from './core/storage/gcs.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

interface ExpressFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

@ApiTags('System')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gcsService: GcsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: '健康檢查' })
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '上傳檔案至 GCS (需 Admin/Coach 權限)' })
  async uploadFile(@UploadedFile() file: ExpressFile) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    const url = await this.gcsService.uploadFile(file, 'general');
    return { url, name: file.originalname };
  }
}
