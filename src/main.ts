import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Challenge API')
    .setDescription('Authentication API — hexagonal architecture')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, swaggerConfig));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
