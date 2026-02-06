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
        const results: any = {
            step: 'init',
            cwd: process.cwd(),
            fs: [],
            migrate: null,
            seed: null
        };

        try {
            console.log('🔄 Iniciando migración remota...');

            // 0. Debug FS
            try {
                const { stdout } = await execAsync('ls -R prisma');
                results.fs = stdout.split('\n');
            } catch (e) { results.fs = 'Error listing files: ' + e.message; }

            // 1. Ejecutar migración (Forzando path)
            results.step = 'migrating';
            console.log('Running: npx prisma migrate deploy');
            // Agregamos --schema para asegurar que tome el archivo correcto
            const { stdout: migrateOut, stderr: migrateErr } = await execAsync('npx prisma migrate deploy --schema=./prisma/schema.prisma');
            results.migrate = { stdout: migrateOut, stderr: migrateErr };

            // 2. Ejecutar seed
            results.step = 'seeding';
            console.log('Running: npx prisma db seed');
            const { stdout: seedOut, stderr: seedErr } = await execAsync('npx prisma db seed');
            results.seed = { stdout: seedOut, stderr: seedErr };

            return {
                status: 'success',
                message: 'Migration and Seed executed successfully',
                details: results
            };
        } catch (error) {
            console.error('❌ Error executing commands:', error);
            // Devolver 200 OK con el error para poder verlo en el navegador
            return {
                status: 'error',
                message: 'Failed to execute remote commands',
                failed_at_step: results.step,
                details: results,
                error_details: {
                    message: error.message,
                    code: error.code,
                    stack: error.stack,
                    cmdOutput: error.stdout,
                    cmdError: error.stderr
                }
            };
        }
    }
}
