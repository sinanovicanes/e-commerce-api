import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerConfig } from './config/services/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      // disableErrorMessages: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(3000);
}
bootstrap();
