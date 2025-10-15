import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { corsOptions } from './config/cors.config';
import { setupSwagger } from './config/swagger-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors(corsOptions);

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludePrefixes: ['password', 'createdAt', 'updatedAt', 'isDeleted'],
      ignoreDecorators: true,
    }),
  );

  setupSwagger(app);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') ?? 3000;
  const NODE_ENV = configService.get<string>('NODE_ENV');

  await app.listen(PORT, () => {
    Logger.log(
      `Application running the port: http://localhost:${PORT}`,
      NestApplication.name
    );
    Logger.log(`Current Environment: ${NODE_ENV}`, NestApplication.name);
  });
}
bootstrap();
