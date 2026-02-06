import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para paginación y filtros de productos
 */
export class QueryProductDto {
    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
        description: 'Número de página',
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        minimum: 1,
        default: 10,
        description: 'Elementos por página',
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @ApiPropertyOptional({
        description: 'Término de búsqueda (por nombre o descripción)',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Filtrar por categoría',
    })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({
        description: 'Filtrar por estado activo/inactivo',
        type: Boolean,
    })
    @IsOptional()
    @Type(() => Boolean)
    isActive?: boolean;
}
