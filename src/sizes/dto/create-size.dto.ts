import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSizeDto {
    @ApiProperty({ example: 'L', description: 'Código de la talla' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Large', description: 'Nombre descriptivo' })
    @IsString()
    @IsNotEmpty()
    displayName: string;

    @ApiPropertyOptional({ example: 10, description: 'Orden para mostrar en UI' })
    @IsInt()
    sortOrder: number = 0;
}
