import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { I18nService } from './i18n.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('I18n')
@Controller('i18n')
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  @Get('translations')
  @ApiOperation({ summary: '獲取全域翻譯 JSON' })
  async getTranslations(@Query('lang') lang: string) {
    return this.i18nService.getTranslations(lang || 'zh-TW');
  }

  @Post('translations')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新翻譯 (僅限 Admin)' })
  async updateTranslation(
    @Body() body: { key: string; translations: Record<string, string> },
  ) {
    return this.i18nService.updateTranslation(body.key, body.translations);
  }

  @Post('ai-translate')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'AI 輔助翻譯 (僅限 Admin)' })
  async aiTranslate(@Body() body: { text: string; targetLang: string }) {
    return this.i18nService.suggestTranslation(body.text, body.targetLang);
  }

  @Get('courses')
  @ApiOperation({ summary: '獲取多語系課程內容' })
  async getCourseTranslations(@Query('lang') lang: string) {
    return this.i18nService.getCourseTranslations(lang || 'zh-TW');
  }
}
