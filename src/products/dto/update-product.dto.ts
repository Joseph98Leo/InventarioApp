import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

/**
 * DTO para actualizar producto
 * Hereda de CreateProductDto y hace opcionales todos los campos
 */
export class UpdateProductDto extends PartialType(CreateProductDto) { }
