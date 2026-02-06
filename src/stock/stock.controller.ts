import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('stock')
@ApiBearerAuth()
@Controller('stock')
export class StockController {
    constructor(private readonly stockService: StockService) { }

    @Post('adjust')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Ajuste manual de stock' })
    @ApiResponse({ status: 200, description: 'Stock actualizado' })
    adjustStock(@Body() adjustStockDto: AdjustStockDto) {
        return this.stockService.adjustStock(adjustStockDto);
    }

    @Get('low')
    @Roles(Role.ADMIN, Role.VENDEDORA)
    @ApiOperation({ summary: 'Alertas de stock bajo' })
    @ApiResponse({ status: 200, description: 'Lista de variantes con bajo stock' })
    getLowStock() {
        return this.stockService.getLowStock();
    }

    @Get('variant/:id')
    @Roles(Role.ADMIN, Role.VENDEDORA)
    @ApiOperation({ summary: 'Consultar stock de una variante' })
    @ApiResponse({ status: 200, description: 'Nivel actual de stock' })
    getStockLevel(@Param('id') id: string) {
        return this.stockService.getStockLevel(id);
    }
    @Get('history/:variantId')
    @Roles(Role.ADMIN, Role.VENDEDORA)
    @ApiOperation({ summary: 'Historial de movimientos de una variante' })
    @ApiResponse({ status: 200, description: 'Historial de transacciones' })
    getStockHistory(@Param('variantId') variantId: string) {
        return this.stockService.getStockHistory(variantId);
    }
}
