import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtro global de excepciones siguiendo best practices
 * - Maneja todo tipo de excepciones (HTTP y no HTTP)
 * - Proporciona formato consistente de respuestas de error
 * - Registra errores para debugging y monitoreo
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | object = 'Error interno del servidor';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            message =
                typeof exceptionResponse === 'string'
                    ? exceptionResponse
                    : (exceptionResponse as any).message || exceptionResponse;
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        // Log del error para debug/monitoreo
        const errorDetails = {
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            statusCode: status,
            message,
        };

        if (status >= 500) {
            this.logger.error(
                `${request.method} ${request.url}`,
                exception instanceof Error ? exception.stack : JSON.stringify(exception),
            );
        } else {
            this.logger.warn(`${request.method} ${request.url} - ${status}`, JSON.stringify(errorDetails));
        }

        // Respuesta estandarizada
        response.status(status).json({
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
