import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateEntryDto } from './dto/create-entry.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, Role } from '@prisma/client';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Post('sale')
    @Roles(Role.ADMIN, Role.VENDEDORA)
    @ApiOperation({ summary: 'Registrar nueva venta' })
    @ApiResponse({ status: 201, description: 'Venta registrada y stock descontado' })
    createSale(@CurrentUser() user: User, @Body() createSaleDto: CreateSaleDto) {
        return this.transactionsService.createSale(user, createSaleDto);
    }

    @Post('entry')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Registrar entrada de mercadería' })
    @ApiResponse({ status: 201, description: 'Entrada registrada y stock aumentado' })
    createEntry(@CurrentUser() user: User, @Body() createEntryDto: CreateEntryDto) {
        return this.transactionsService.createEntry(user, createEntryDto);
    }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Historial de transacciones' })
    @ApiResponse({ status: 200, description: 'Listado de transacciones' })
    findAll(@Query() query: QueryTransactionDto) {
        return this.transactionsService.findAll(query);
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Detalle de transacción' })
    @ApiResponse({ status: 200, description: 'Detalle completo' })
    findOne(@Param('id') id: string) {
        return this.transactionsService.findOne(id);
    }

    @Post(':id/cancel')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Cancelar transacción' })
    @ApiResponse({ status: 200, description: 'Transacción cancelada y stock revertido' })
    cancel(@Param('id') id: string) {
        return this.transactionsService.cancel(id);
    }
}
