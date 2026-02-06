import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SizesService } from './sizes.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('sizes')
@ApiBearerAuth()
@Controller('sizes')
export class SizesController {
    constructor(private readonly sizesService: SizesService) { }

    @Get()
    @Roles(Role.ADMIN, Role.VENDEDORA)
    @ApiOperation({ summary: 'Listar todas las tallas disponibles' })
    @ApiResponse({ status: 200, description: 'Catálogo de tallas' })
    findAll() {
        return this.sizesService.findAll();
    }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Crear nueva talla (Admin)' })
    @ApiResponse({ status: 201, description: 'Talla creada' })
    create(@Body() createSizeDto: CreateSizeDto) {
        return this.sizesService.create(createSizeDto);
    }
}
