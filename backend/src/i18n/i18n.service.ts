import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class I18nService {
  constructor(private prisma: PrismaService) {}

  // 獲取課程的多語系標題與描述
  async getCourseI18n(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true, description: true },
    });
    return course;
  }

  // 更新多語系內容 (用於免部署校正)
  async updateCourseI18n(
    courseId: string,
    data: { title?: any; description?: any },
  ) {
    return this.prisma.course.update({
      where: { id: courseId },
      data: {
        title: data.title,
        description: data.description,
      },
    });
  }

  // 獲取所有翻譯 Dictionary (用於前端一次性快取)
  async getFullDictionary(lang: string) {
    // 這裡未來可以串接 Redis 快取
    // 目前先從資料庫或靜態資源整合
    return {
      welcome: lang === 'zh_TW' ? '歡迎' : 'Welcome',
      // ... 更多動態翻譯
    };
  }
}
