import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateEntryDto } from './dto/create-entry.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { TransactionType, TransactionStatus, Prisma, User } from '@prisma/client';

@Injectable()
export class TransactionsService {
    constructor(private readonly prisma: PrismaService) { }

    async createSale(user: User, createSaleDto: CreateSaleDto) {
        // 1. Validar stock y calcular total
        let total = 0;

        // Iniciar transacción interactiva
        return this.prisma.$transaction(async (tx) => {
            // Verificar disponibilidad de items
            for (const item of createSaleDto.items) {
                const variant = await tx.productVariant.findUnique({
                    where: { id: item.variantId },
                });

                if (!variant) {
                    throw new NotFoundException(`Variante ${item.variantId} no encontrada`);
                }

                if (variant.stock < item.quantity) {
                    throw new BadRequestException(`Stock insuficiente para variante ${item.variantId}`);
                }

                total += item.quantity * item.unitPrice;
            }

            // 2. Crear transacción
            const transaction = await tx.transaction.create({
                data: {
                    type: TransactionType.VENTA,
                    status: TransactionStatus.COMPLETADA,
                    userId: user.id,
                    total: new Prisma.Decimal(total),
                    notes: createSaleDto.notes,
                    items: {
                        create: createSaleDto.items.map(item => ({
                            variantId: item.variantId,
                            quantity: item.quantity,
                            unitPrice: new Prisma.Decimal(item.unitPrice),
                            subtotal: new Prisma.Decimal(item.quantity * item.unitPrice),
                        })),
                    },
                },
                include: { items: true },
            });

            // 3. Decrementar stock
            for (const item of createSaleDto.items) {
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            return transaction;
        });
    }

    async createEntry(user: User, createEntryDto: CreateEntryDto) {
        return this.prisma.$transaction(async (tx) => {
            // Crear transacción de entrada
            const transaction = await tx.transaction.create({
                data: {
                    type: TransactionType.ENTRADA,
                    status: TransactionStatus.COMPLETADA,
                    userId: user.id,
                    total: new Prisma.Decimal(0), // Entradas no necesariamente tienen total venta
                    notes: createEntryDto.notes,
                    items: {
                        create: createEntryDto.items.map(item => ({
                            variantId: item.variantId,
                            quantity: item.quantity,
                            unitPrice: new Prisma.Decimal(item.unitCost || 0),
                            subtotal: new Prisma.Decimal(0),
                        })),
                    },
                },
            });

            // Incrementar stock
            for (const item of createEntryDto.items) {
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: { stock: { increment: item.quantity } },
                });
            }

            return transaction;
        });
    }

    async findAll(query: QueryTransactionDto) {
        const { page = 1, limit = 10, type, status, startDate, endDate } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.TransactionWhereInput = {
            AND: [
                type ? { type } : {},
                status ? { status } : {},
                startDate ? { createdAt: { gte: new Date(startDate) } } : {},
                endDate ? { createdAt: { lte: new Date(endDate) } } : {},
            ],
        };

        const [total, transactions] = await Promise.all([
            this.prisma.transaction.count({ where }),
            this.prisma.transaction.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true, email: true } } },
            }),
        ]);

        return {
            data: transactions,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    findOne(id: string) {
        return this.prisma.transaction.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        variant: {
                            include: { product: true, size: true },
                        },
                    },
                },
                user: { select: { name: true, email: true } },
            },
        });
    }

    async cancel(id: string) {
        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.findUnique({
                where: { id },
                include: { items: true },
            });

            if (!transaction) throw new NotFoundException('Transacción no encontrada');
            if (transaction.status === TransactionStatus.CANCELADA) {
                throw new BadRequestException('La transacción ya está cancelada');
            }

            // Revertir stock
            for (const item of transaction.items) {
                if (transaction.type === TransactionType.VENTA) {
                    // Si era venta, devolver stock
                    await tx.productVariant.update({
                        where: { id: item.variantId },
                        data: { stock: { increment: item.quantity } },
                    });
                } else if (transaction.type === TransactionType.ENTRADA) {
                    // Si era entrada, retirar stock (cuidado con stock negativo)
                    await tx.productVariant.update({
                        where: { id: item.variantId },
                        data: { stock: { decrement: item.quantity } },
                    });
                }
            }

            return tx.transaction.update({
                where: { id },
                data: { status: TransactionStatus.CANCELADA },
            });
        });
    }
}
