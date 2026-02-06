import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Prisma } from '@prisma/client';
import 'multer';

/**
 * Service para gestión de productos
 * Implementa CRUD y paginación
 */
@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createProductDto: CreateProductDto) {
        return this.prisma.product.create({
            data: createProductDto,
        });
    }

    async findAll(query: QueryProductDto) {
        const { page = 1, limit = 10, search, category, isActive } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.ProductWhereInput = {
            AND: [
                isActive !== undefined ? { isActive } : {},
                category ? { category: { contains: category, mode: 'insensitive' } } : {},
                search
                    ? {
                        OR: [
                            { name: { contains: search, mode: 'insensitive' } },
                            { description: { contains: search, mode: 'insensitive' } },
                        ],
                    }
                    : {},
            ],
        };

        const [total, products] = await Promise.all([
            this.prisma.product.count({ where }),
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { variants: true },
                    },
                },
            }),
        ]);

        return {
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                variants: {
                    include: {
                        size: true,
                    },
                },
            },
        });

        if (!product) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        await this.findOne(id); // Verificar existencia

        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
        });
    }

    async remove(id: string) {
        await this.findOne(id); // Verificar existencia

        // Soft delete
        return this.prisma.product.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async uploadImage(id: string, file: Express.Multer.File) {
        await this.findOne(id);

        const imageUrl = `${process.env.APP_URL || 'http://localhost:3001'}/uploads/products/${file.filename}`;

        return this.prisma.product.update({
            where: { id },
            data: { imageUrl },
        });
    }
}
