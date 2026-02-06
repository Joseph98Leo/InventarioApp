import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Formato de respuesta estandarizado
 */
export interface Response<T> {
    data: T;
    statusCode: number;
    timestamp: string;
}

/**
 * Interceptor para transformar respuestas a formato estandarizado
 * Best practice: Respuestas consistentes en toda la API
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const statusCode = context.switchToHttp().getResponse().statusCode;

        return next.handle().pipe(
            map((data) => ({
                data,
                statusCode,
                timestamp: new Date().toISOString(),
            })),
        );
    }
}
