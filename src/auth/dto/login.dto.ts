import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para login siguiendo best practices
 * - class-validator para validación automática
 * - Swagger decorators para documentación
 */
export class LoginDto {
    @ApiProperty({
        example: 'admin@tienda.com',
        description: 'Email del usuario',
    })
    @IsEmail({}, { message: 'Email debe ser válido' })
    @IsNotEmpty({ message: 'Email es requerido' })
    email: string;

    @ApiProperty({
        example: 'Admin123!',
        description: 'Contraseña del usuario',
        minLength: 6,
    })
    @IsNotEmpty({ message: 'Contraseña es requerida' })
    @IsString()
    @MinLength(6, { message: 'Contraseña debe tener al menos 6 caracteres' })
    password: string;
}
