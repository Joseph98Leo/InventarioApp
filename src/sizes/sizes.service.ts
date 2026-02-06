import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSizeDto } from './dto/create-size.dto';

@Injectable()
export class SizesService {
    constructor(private readonly prisma: PrismaService) { }

    findAll() {
        return this.prisma.size.findMany({
            orderBy: { sortOrder: 'asc' },
        });
    }

    create(createSizeDto: CreateSizeDto) {
        return this.prisma.size.create({
            data: createSizeDto,
        });
    }
}
