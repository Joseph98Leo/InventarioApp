import { IsString, IsNotEmpty, IsUUID, IsInt, Min, IsOptional, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateVariantDto {
    @ApiProperty({ description: 'ID de la talla (Size)' })
    @IsUUID()
    @IsNotEmpty()
    sizeId: string;

    @ApiProperty({ example: 'Rojo', description: 'Color del producto' })
    @IsString()
    @IsNotEmpty()
    color: string;

    @ApiPropertyOptional({ example: 100, description: 'Stock inicial', default: 0 })
    @IsInt()
    @Min(0)
    @IsOptional()
    stock?: number;

    @ApiPropertyOptional({ example: 25.50, description: 'Precio específico para esta variante' })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    priceOverride?: number;
}
