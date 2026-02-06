import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

/**
 * Payload del JWT token
 */
export interface JwtPayload {
    sub: string; // user ID
    email: string;
    role: string;
    iat?: number;
}

/**
 * Estrategia JWT siguiendo best practices
 * - Verifica la validez del token
 * - Valida que el usuario siga existiendo y activo
 * - Inyecta el usuario en la request
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
            issuer: configService.get<string>('JWT_ISSUER'),
            audience: configService.get<string>('JWT_AUDIENCE'),
        });
    }

    /**
     * Valida el payload y retorna el usuario
     * Best practice: Verificar que el usuario existe y está activo
     */
    async validate(payload: JwtPayload): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedException('Usuario no encontrado o inactivo');
        }

        return user; // Se inyecta en request.user
    }
}
