import { IsString, IsNotEmpty, IsNumber, IsOptional, IsPositive, Min, IsUrl, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para crear un producto
 * Best Practice: Validación estricta de tipos y Swagger docs
 */
export class CreateProductDto {
    @ApiProperty({
        example: 'Camisa Oxford',
        description: 'Nombre del producto',
    })
    @IsString()
    @IsNotEmpty({ message: 'El nombre es requerido' })
    name: string;

    @ApiPropertyOptional({
        example: 'Camisa formal de algodón 100%',
        description: 'Descripción detallada del producto',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        example: 'Camisas',
        description: 'Categoría del producto',
    })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiProperty({
        example: 29.99,
        description: 'Precio base del producto',
        minimum: 0,
    })
    @IsNumber()
    @IsPositive({ message: 'El precio debe ser positivo' })
    @Type(() => Number)
    basePrice: number;

    @ApiPropertyOptional({
        example: 'https://example.com/image.jpg',
        description: 'URL de la imagen del producto',
    })
    @IsOptional()
    @IsString()
    @IsUrl({}, { message: 'Debe ser una URL válida' })
    imageUrl?: string;

    @ApiPropertyOptional({
        default: true,
        description: 'Si el producto está activo y visible',
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
