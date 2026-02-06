import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Service siguiendo best practices de NestJS
 * - Maneja el ciclo de vida de la conexión
 * - Se exporta globalmente via PrismaModule
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('✅ Conexión a base de datos establecida');
        } catch (error) {
            this.logger.error('❌ Error al conectar a la base de datos', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('🔌 Desconexión de base de datos completada');
    }

    /**
     * Helper para limpiar la base de datos (útil en tests)
     */
    async cleanDatabase() {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('No se puede limpiar la base de datos en producción');
        }

        const models = Reflect.ownKeys(this).filter(
            (key) => typeof key === 'string' && key[0] !== '_' && key[0] !== '$',
        );

        return Promise.all(
            models.map((modelKey) => {
                const model = this[modelKey as keyof this];
                if (model && typeof model === 'object' && 'deleteMany' in model) {
                    return (model as any).deleteMany();
                }
            }),
        );
    }
}
