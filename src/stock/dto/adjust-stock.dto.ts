import { IsUUID, IsNotEmpty, IsInt, IsEnum, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum StockAdjustmentType {
    INCREASE = 'INCREASE',
    DECREASE = 'DECREASE',
    SET = 'SET'
}

export class AdjustStockDto {
    @ApiProperty({ description: 'ID de la variante de producto' })
    @IsUUID()
    @IsNotEmpty()
    variantId: string;

    @ApiProperty({ description: 'Cantidad a ajustar', example: 5 })
    @IsInt()
    quantity: number;

    @ApiProperty({ enum: StockAdjustmentType, description: 'Tipo de ajuste' })
    @IsEnum(StockAdjustmentType)
    type: StockAdjustmentType;

    @ApiPropertyOptional({ description: 'Razón del ajuste' })
    @IsString()
    @IsOptional()
    reason?: string;
}
