import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

/**
 * UsersService siguiendo best practices
 * - Responsabilidad única: gestión de usuarios
 * - Usa PrismaService para acceso a datos
 * - Lanza excepciones HTTP apropiadas
 */
@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Crear un nuevo usuario
     */
    async create(data: {
        email: string;
        password: string;
        name: string;
        role: any;
    }): Promise<Omit<User, 'password'>> {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });

        // Excluir password de la respuesta
        const { password, ...result } = user;
        return result;
    }

    /**
     * Buscar usuario por email (para login)
     */
    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    /**
     * Buscar usuario por ID
     */
    async findOne(id: string): Promise<Omit<User, 'password'>> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        const { password, ...result } = user;
        return result;
    }

    /**
     * Listar todos los usuarios (solo admin)
     */
    async findAll(): Promise<Omit<User, 'password'>[]> {
        const users = await this.prisma.user.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });

        return users.map(({ password, ...user }) => user);
    }

    /**
     * Actualizar usuario
     */
    async update(
        id: string,
        data: Partial<{ name: string; isActive: boolean }>,
    ): Promise<Omit<User, 'password'>> {
        const user = await this.prisma.user.update({
            where: { id },
            data,
        });

        const { password, ...result } = user;
        return result;
    }
}
