import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. 啟用 CORS (允許前端存取)
  app.enableCors();

  // 2. 全域 DTO 驗證器 (Stripping un-annotated properties)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 3. 配置 API 版本字首
  app.setGlobalPrefix('api/v1');

  // 4. Swagger OpenAPI 配置
  const config = new DocumentBuilder()
    .setTitle('Snowboarding V2 API')
    .setDescription('專家級滑雪預約系統 API 規格書')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => console.error(err));
