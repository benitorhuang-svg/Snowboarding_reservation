import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { I18nService } from './i18n.service';

@Controller('i18n')
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  @Get('dictionary')
  getDictionary(@Query('lang') lang: string = 'zh_TW') {
    return this.i18nService.getFullDictionary(lang);
  }

  @Get('course/:id')
  getCourseI18n(@Param('id') id: string) {
    return this.i18nService.getCourseI18n(id);
  }

  @Post('course/:id')
  updateCourseI18n(@Param('id') id: string, @Body() data: any) {
    return this.i18nService.updateCourseI18n(id, data);
  }
}
