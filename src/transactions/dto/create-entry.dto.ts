import { IsUUID, IsNotEmpty, IsInt, Min, IsNumber, IsPositive, ValidateNested, IsArray, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class EntryItemDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    variantId: string;

    @ApiProperty({ description: 'Cantidad recibida', minimum: 1 })
    @IsInt()
    @Min(1)
    quantity: number;

    @ApiProperty({ description: 'Costo unitario (opcional para tracking)' })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    unitCost?: number;
}

export class CreateEntryDto {
    @ApiProperty({ type: [EntryItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EntryItemDto)
    items: EntryItemDto[];

    @ApiProperty({ description: 'Notas opcionales' })
    @IsString()
    @IsOptional()
    notes?: string;
}
