import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';

@Injectable()
export class I18nService {
  private readonly logger = new Logger(I18nService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  /**
   * Get all translations for a specific language (F1).
   * Uses Redis for performance with fallback cache.
   */
  async getTranslations(lang: string): Promise<Record<string, string>> {
    const cacheKey = `i18n:${lang}`;

    // 1. Try Redis Cache
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached) as Record<string, string>;
      } catch {
        this.logger.error('Failed to parse cached translations');
      }
    }

    // 2. Fetch from DB
    const entries = await this.prisma.translation.findMany();
    const map: Record<string, string> = {};

    entries.forEach((entry) => {
      let value = '';
      const l = lang.toLowerCase();
      if (l === 'en') value = entry.en;
      else if (l === 'ja') value = entry.ja;
      else if (l === 'zh-hk') value = entry.zh_HK;
      else value = entry.zh_TW; // Default

      map[entry.key] = value || entry.zh_TW || '';
    });

    // 3. Update Redis (Expire in 1 hour)
    await this.redis.set(cacheKey, JSON.stringify(map), 'EX', 3600);

    return map;
  }

  /**
   * Update or create a translation (B12).
   */
  async updateTranslation(key: string, translations: Record<string, string>) {
    const entry = await this.prisma.translation.upsert({
      where: { key },
      update: {
        zh_TW: translations['zh-tw'] || translations['zh_TW'],
        en: translations['en'],
        ja: translations['ja'],
        zh_HK: translations['zh-hk'] || translations['zh_HK'],
      },
      create: {
        key,
        zh_TW: translations['zh-tw'] || translations['zh_TW'] || '',
        en: translations['en'] || '',
        ja: translations['ja'] || '',
        zh_HK: translations['zh-hk'] || translations['zh_HK'] || '',
      },
    });

    // Evict all language caches to be safe
    const langs = ['en', 'zh-tw', 'ja', 'zh-hk'];
    for (const lang of langs) {
      await this.redis.del(`i18n:${lang}`);
    }

    return entry;
  }

  /**
   * AI-Assisted Translation (B17 - Simulation).
   */
  async suggestTranslation(text: string, targetLang: string) {
    this.logger.log(`Simulating AI translation for: ${text} -> ${targetLang}`);

    // Simulate async work
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      original: text,
      suggested: `[AI ${targetLang}] ${text}`,
      confidence: 0.95,
    };
  }

  /**
   * Helper for dynamic course translations.
   */
  async getCourseTranslations(lang: string) {
    const courses = await this.prisma.course.findMany({
      select: { id: true, title: true, description: true },
    });

    return courses.map((c) => {
      const title = c.title as Record<string, string>;
      const desc = c.description as Record<string, string>;
      const l = lang.toLowerCase();
      return {
        id: c.id,
        title: title[l] || title['zh-tw'] || '',
        description: desc[l] || desc['zh-tw'] || '',
      };
    });
  }
}
