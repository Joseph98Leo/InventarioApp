import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

/**
 * Bootstrap de la aplicación siguiendo best practices de NestJS
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  // Prefijo global de API
  app.setGlobalPrefix('api/v1');

  // CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', '*').split(','),
    credentials: true,
  });

  // Validation Pipe global (best practice: validar todo el input)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remover propiedades no definidas en DTO
      forbidNonWhitelisted: true, // Lanzar error si hay propiedades extra
      transform: true, // Transformar payloads a instancias de DTO
      transformOptions: {
        enableImplicitConversion: true, // Conversión automática de tipos
      },
    }),
  );

  // Exception filter global
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('API de Inventario de Tienda de Ropa')
    .setDescription(
      'API RESTful para gestionar inventario de productos de ropa con variantes, stock y transacciones',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticación y autorización')
    .addTag('users', 'Gestión de usuarios')
    .addTag('products', 'Gestión de productos')
    .addTag('sizes', 'Catálogo de tallas')
    .addTag('variants', 'Variantes de productos (talla + color)')
    .addTag('transactions', 'Transacciones de venta y entrada de stock')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'API Docs - Inventario',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(port);
  logger.log(`🚀 Aplicación corriendo en: http://localhost:${port}`);
  logger.log(`📚 Documentación Swagger: http://localhost:${port}/api/docs`);
  logger.log(`🔧 Ambiente: ${configService.get<string>('NODE_ENV', 'development')}`);
}

bootstrap();
