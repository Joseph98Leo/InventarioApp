import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Public } from './common/decorators/public.decorator';

const execAsync = promisify(exec);

@Controller('sys')
export class SystemController {

    @Public()
    @Get('migrate')
    async runMigrations() {
        try {
            console.log('🔄 Iniciando migración remota...');

            // 1. Ejecutar migración
            console.log('Running: npx prisma migrate deploy');
            const { stdout: migrateOut, stderr: migrateErr } = await execAsync('npx prisma migrate deploy');
            console.log('Migrate Output:', migrateOut);
            if (migrateErr) console.warn('Migrate Warning:', migrateErr);

            // 2. Ejecutar seed
            console.log('Running: npx prisma db seed');
            const { stdout: seedOut, stderr: seedErr } = await execAsync('npx prisma db seed');
            console.log('Seed Output:', seedOut);
            if (seedErr) console.warn('Seed Warning:', seedErr);

            return {
                status: 'success',
                message: 'Migration and Seed executed successfully',
                details: {
                    migration: migrateOut,
                    seed: seedOut
                }
            };
        } catch (error) {
            console.error('❌ Error executing commands:', error);
            // Devolver 200 OK con el error para poder verlo en el navegador
            // y no sea ocultado por el ExceptionFilter
            return {
                status: 'error',
                message: 'Failed to execute remote commands',
                cwd: process.cwd(),
                error_details: {
                    message: error.message,
                    code: error.code,
                    stack: error.stack,
                    cmdOutput: error.stdout, // Si existe
                    cmdError: error.stderr   // Si existe
                }
            };
        }
    }
}
