import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Injectable()
export class VariantsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(productId: string, createVariantDto: CreateVariantDto) {
        // Verificar si ya existe esta variante
        const existing = await this.prisma.productVariant.findFirst({
            where: {
                productId,
                sizeId: createVariantDto.sizeId,
                color: createVariantDto.color,
            },
        });

        if (existing) {
            throw new BadRequestException('Esta variante ya existe para el producto');
        }

        return this.prisma.productVariant.create({
            data: {
                ...createVariantDto,
                productId,
            },
            include: {
                size: true,
            },
        });
    }

    findByProduct(productId: string) {
        return this.prisma.productVariant.findMany({
            where: { productId },
            include: { size: true },
            orderBy: { size: { sortOrder: 'asc' } },
        });
    }

    async update(id: string, updateVariantDto: UpdateVariantDto) {
        try {
            return await this.prisma.productVariant.update({
                where: { id },
                data: updateVariantDto,
                include: { size: true },
            });
        } catch (error) {
            throw new NotFoundException(`Variante con ID ${id} no encontrada`);
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.productVariant.delete({
                where: { id },
            });
        } catch (error) {
            throw new NotFoundException(`Variante con ID ${id} no encontrada`);
        }
    }
}
