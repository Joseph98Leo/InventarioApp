import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('variants')
@ApiBearerAuth()
@Controller()
export class VariantsController {
    constructor(private readonly variantsService: VariantsService) { }

    @Post('products/:productId/variants')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Agregar variante a un producto' })
    @ApiResponse({ status: 201, description: 'Variante creada' })
    create(@Param('productId') productId: string, @Body() createVariantDto: CreateVariantDto) {
        return this.variantsService.create(productId, createVariantDto);
    }

    @Get('products/:productId/variants')
    @Roles(Role.ADMIN, Role.VENDEDORA)
    @ApiOperation({ summary: 'Listar variantes de un producto' })
    @ApiResponse({ status: 200, description: 'Lista de variantes' })
    findByProduct(@Param('productId') productId: string) {
        return this.variantsService.findByProduct(productId);
    }

    @Patch('variants/:id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Actualizar variante' })
    @ApiResponse({ status: 200, description: 'Variante actualizada' })
    update(@Param('id') id: string, @Body() updateVariantDto: UpdateVariantDto) {
        return this.variantsService.update(id, updateVariantDto);
    }

    @Delete('variants/:id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Eliminar variante' })
    @ApiResponse({ status: 200, description: 'Variante eliminada' })
    remove(@Param('id') id: string) {
        return this.variantsService.remove(id);
    }
}
