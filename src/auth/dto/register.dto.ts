import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

/**
 * DTO para registro de usuario (solo admin puede registrar)
 */
export class RegisterDto {
    @ApiProperty({
        example: 'vendedora@tienda.com',
        description: 'Email del usuario',
    })
    @IsEmail({}, { message: 'Email debe ser válido' })
    @IsNotEmpty({ message: 'Email es requerido' })
    email: string;

    @ApiProperty({
        example: 'Vendedora123!',
        description: 'Contraseña del usuario',
        minLength: 6,
    })
    @IsNotEmpty({ message: 'Contraseña es requerida' })
    @IsString()
    @MinLength(6, { message: 'Contraseña debe tener al menos 6 caracteres' })
    password: string;

    @ApiProperty({
        example: 'María González',
        description: 'Nombre completo del usuario',
    })
    @IsNotEmpty({ message: 'Nombre es requerido' })
    @IsString()
    name: string;

    @ApiProperty({
        enum: Role,
        example: 'VENDEDORA',
        description: 'Rol del usuario',
    })
    @IsEnum(Role, { message: 'Rol debe ser ADMIN o VENDEDORA' })
    role: Role;
}
