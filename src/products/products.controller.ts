import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import 'multer'; // Ensure types are loaded
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';

/**
 * Controller para gestión de productos
 * Algunos endpoints son públicos (listar, ver detalle) para el frontend de la tienda (si aplica)
 * Gestión (crear, editar, eliminar) restringida a admin/vendedora
 */
@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Crear un nuevo producto' })
    @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
    @ApiResponse({ status: 403, description: 'Requiere rol ADMIN' })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.VENDEDORA)
    @ApiOperation({ summary: 'Listar productos con paginación y filtros' })
    @ApiResponse({ status: 200, description: 'Lista de productos paginada' })
    findAll(@Query() query: QueryProductDto) {
        return this.productsService.findAll(query);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.VENDEDORA)
    @ApiOperation({ summary: 'Obtener detalle de producto' })
    @ApiResponse({ status: 200, description: 'Detalle del producto y sus variantes' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Actualizar producto' })
    @ApiResponse({ status: 200, description: 'Producto actualizado' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Eliminar producto (Soft Delete)' })
    @ApiResponse({ status: 200, description: 'Producto marcado como inactivo' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }

    @Post(':id/image')
    @Roles(Role.ADMIN)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/products',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                return cb(new BadRequestException('Solo se permiten imágenes'), false);
            }
            cb(null, true);
        },
    }))
    @ApiOperation({ summary: 'Subir imagen de producto' })
    @ApiResponse({ status: 201, description: 'Imagen subida exitosamente' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    uploadImage(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) throw new BadRequestException('Archivo no proporcionado');
        return this.productsService.uploadImage(id, file);
    }
}
