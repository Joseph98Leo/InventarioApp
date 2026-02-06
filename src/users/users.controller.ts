import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';

import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, Role } from '@prisma/client';

/**
 * Controller de usuarios siguiendo best practices
 * - Decoradores Swagger para documentación
 * - Guards para autenticación y autorización
 * - Respuestas HTTP apropiadas
 */
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
    @ApiResponse({ status: 200, description: 'Perfil obtenido' })
    async getProfile(@CurrentUser() user: User) {
        return this.usersService.findOne(user.id);
    }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Listar todos los usuarios (solo admin)' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Obtener usuario por ID (solo admin)' })
    @ApiResponse({ status: 200, description: 'Usuario encontrado' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }
}
