import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de la base de datos...');

    // 1. Crear usuario admin
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@tienda.com' },
        update: {},
        create: {
            email: 'admin@tienda.com',
            password: hashedPassword,
            name: 'Administrador',
            role: 'ADMIN',
        },
    });
    console.log('✅ Usuario admin creado:', admin.email);

    // Crear vendedora
    const vendedoraPassword = await bcrypt.hash('Vendedora123!', 10);
    const vendedora = await prisma.user.upsert({
        where: { email: 'vendedora@tienda.com' },
        update: {},
        create: {
            email: 'vendedora@tienda.com',
            password: vendedoraPassword,
            name: 'María Vendedora',
            role: 'VENDEDORA',
        },
    });
    console.log('✅ Usuario vendedora creado:', vendedora.email);

    // 2. Crear catálogo de tallas
    const sizes = [
        { name: 'XS', displayName: 'Extra Small', sortOrder: 1 },
        { name: 'S', displayName: 'Small', sortOrder: 2 },
        { name: 'M', displayName: 'Mediano', sortOrder: 3 },
        { name: 'L', displayName: 'Large', sortOrder: 4 },
        { name: 'XL', displayName: 'Extra Large', sortOrder: 5 },
        { name: 'XXL', displayName: 'Double XL', sortOrder: 6 },
        { name: 'UNICA', displayName: 'Talla Única', sortOrder: 0 },
        { name: '36', displayName: 'Talla 36', sortOrder: 7 },
        { name: '38', displayName: 'Talla 38', sortOrder: 8 },
        { name: '40', displayName: 'Talla 40', sortOrder: 9 },
        { name: '42', displayName: 'Talla 42', sortOrder: 10 },
        { name: '44', displayName: 'Talla 44', sortOrder: 11 },
    ];

    for (const size of sizes) {
        await prisma.size.upsert({
            where: { name: size.name },
            update: {},
            create: size,
        });
    }
    console.log(`✅ ${sizes.length} tallas creadas`);

    // 3. Crear productos de ejemplo
    const camisaProduct = await prisma.product.create({
        data: {
            name: 'Camisa Casual Clásica',
            description: 'Camisa de algodón 100% perfecta para el día a día',
            category: 'Camisas',
            basePrice: 45.00,
        },
    });

    const pantalonProduct = await prisma.product.create({
        data: {
            name: 'Pantalón Jean Slim Fit',
            description: 'Pantalón jean de corte moderno y cómodo',
            category: 'Pantalones',
            basePrice: 65.00,
        },
    });

    const vestidoProduct = await prisma.product.create({
        data: {
            name: 'Vestido Elegante',
            description: 'Vestido para ocasiones especiales',
            category: 'Vestidos',
            basePrice: 120.00,
        },
    });

    console.log('✅ 3 productos de ejemplo creados');

    // 4. Crear variantes de productos
    const sizeM = await prisma.size.findUnique({ where: { name: 'M' } });
    const sizeL = await prisma.size.findUnique({ where: { name: 'L' } });
    const sizeXL = await prisma.size.findUnique({ where: { name: 'XL' } });
    const size40 = await prisma.size.findUnique({ where: { name: '40' } });
    const size42 = await prisma.size.findUnique({ where: { name: '42' } });

    // Variantes de camisa
    await prisma.productVariant.createMany({
        data: [
            { productId: camisaProduct.id, sizeId: sizeM!.id, color: 'Blanco', stock: 10, sku: 'CAM-BLA-M' },
            { productId: camisaProduct.id, sizeId: sizeM!.id, color: 'Azul', stock: 8, sku: 'CAM-AZU-M' },
            { productId: camisaProduct.id, sizeId: sizeL!.id, color: 'Blanco', stock: 12, sku: 'CAM-BLA-L' },
            { productId: camisaProduct.id, sizeId: sizeL!.id, color: 'Negro', stock: 5, sku: 'CAM-NEG-L' },
            { productId: camisaProduct.id, sizeId: sizeXL!.id, color: 'Azul', stock: 7, sku: 'CAM-AZU-XL' },
        ],
    });

    // Variantes de pantalón
    await prisma.productVariant.createMany({
        data: [
            { productId: pantalonProduct.id, sizeId: size40!.id, color: 'Azul Oscuro', stock: 15, sku: 'PAN-AZO-40' },
            { productId: pantalonProduct.id, sizeId: size42!.id, color: 'Azul Oscuro', stock: 12, sku: 'PAN-AZO-42' },
            { productId: pantalonProduct.id, sizeId: size40!.id, color: 'Negro', stock: 10, sku: 'PAN-NEG-40' },
        ],
    });

    // Variantes de vestido
    await prisma.productVariant.createMany({
        data: [
            { productId: vestidoProduct.id, sizeId: sizeM!.id, color: 'Rojo', stock: 5, priceOverride: 130.00, sku: 'VES-ROJ-M' },
            { productId: vestidoProduct.id, sizeId: sizeL!.id, color: 'Negro', stock: 6, sku: 'VES-NEG-L' },
        ],
    });

    console.log('✅ Variantes de productos creadas con stock inicial');

    console.log('\n🎉 Seed completado exitosamente!');
    console.log('\n📝 Credenciales de acceso:');
    console.log('   Admin: admin@tienda.com / Admin123!');
    console.log('   Vendedora: vendedora@tienda.com / Vendedora123!');
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
