import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Módulo global de Prisma
 * - Marca con @Global() para que esté disponible en toda la aplicación
 * - Solo se importa una vez en AppModule
 * - Exporta PrismaService para inyección en otros módulos
 */
@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }
