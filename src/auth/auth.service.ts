import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

/**
 * AuthService siguiendo best practices
 * - Responsabilidad única: autenticación
 * - Manejo seguro de contraseñas con bcrypt
 * - Excepciones HTTP apropiadas
 */
@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * Login de usuario
     */
    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Usuario inactivo');
        }

        // Payload mínimo para JWT (best practice: no incluir datos sensibles)
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }

    /**
     * Registro de usuario (solo admin puede registrar)
     */
    async register(registerDto: RegisterDto) {
        // Verificar si el email ya existe
        const existingUser = await this.usersService.findByEmail(registerDto.email);

        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        const user = await this.usersService.create(registerDto);
        return user;
    }
}
