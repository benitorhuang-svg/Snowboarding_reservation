import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { I18nModule } from './i18n/i18n.module';

@Module({
  imports: [I18nModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
