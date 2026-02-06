import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdjustStockDto, StockAdjustmentType } from './dto/adjust-stock.dto';

@Injectable()
export class StockService {
    constructor(private readonly prisma: PrismaService) { }

    async adjustStock(dto: AdjustStockDto) {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: dto.variantId },
        });

        if (!variant) {
            throw new NotFoundException(`Variante no encontrada`);
        }

        let newStock = variant.stock;

        switch (dto.type) {
            case StockAdjustmentType.INCREASE:
                newStock += dto.quantity;
                break;
            case StockAdjustmentType.DECREASE:
                newStock = Math.max(0, newStock - dto.quantity);
                break;
            case StockAdjustmentType.SET:
                newStock = dto.quantity;
                break;
        }

        // Actualizar stock directamente
        // TODO: Registrar movimiento en historial si se implementa esa tabla
        return this.prisma.productVariant.update({
            where: { id: dto.variantId },
            data: { stock: newStock },
            include: { product: true, size: true },
        });
    }

    async getStockHistory(variantId: string) {
        // Buscar transacciones que incluyan esta variante
        // Esto requiere acceso a TransactionItems
        return this.prisma.transactionItem.findMany({
            where: { variantId },
            include: {
                transaction: {
                    select: {
                        id: true,
                        type: true,
                        createdAt: true,
                        user: { select: { name: true } }
                    }
                }
            },
            orderBy: { transaction: { createdAt: 'desc' } }
        });
    }

    async getLowStock(threshold: number = 5) {
        return this.prisma.productVariant.findMany({
            where: {
                stock: { lte: threshold },
                isActive: true,
            },
            include: {
                product: true,
                size: true,
            },
        });
    }

    getStockLevel(variantId: string) {
        return this.prisma.productVariant.findUnique({
            where: { id: variantId },
            select: { id: true, stock: true },
        });
    }
}
