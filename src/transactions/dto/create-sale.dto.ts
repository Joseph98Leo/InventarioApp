import { IsUUID, IsNotEmpty, IsInt, Min, IsNumber, IsPositive, ValidateNested, IsArray, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionItemDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    variantId: string;

    @ApiProperty({ description: 'Cantidad vendida', minimum: 1 })
    @IsInt()
    @Min(1)
    quantity: number;

    @ApiProperty({ description: 'Precio unitario al momento de la venta' })
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    unitPrice: number;
}

export class CreateSaleDto {
    @ApiProperty({ type: [TransactionItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TransactionItemDto)
    items: TransactionItemDto[];

    @ApiProperty({ description: 'Notas opcionales' })
    @IsString()
    @IsOptional()
    notes?: string;
}


