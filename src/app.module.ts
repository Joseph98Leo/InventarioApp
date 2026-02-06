import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { ProductsModule } from './products/products.module';
import { SizesModule } from './sizes/sizes.module';
import { VariantsModule } from './variants/variants.module';
import { StockModule } from './stock/stock.module';
import { TransactionsModule } from './transactions/transactions.module';

/**
 * AppModule principal siguiendo best practices
 * - ConfigModule global para variables de entorno
 * - PrismaModule global para acceso a BD
 * - Guards globales para autenticación y autorización
 */
@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Servir archivos estáticos (imágenes de productos)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // Módulos core
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,

    SizesModule,
    VariantsModule,
    StockModule,
    TransactionsModule,
  ],
  providers: [
    // Guards globales (se ejecutan en todas las rutas)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
