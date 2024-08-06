import { UpdateProductDto } from '../dtos';
import { Product } from '../schemas';

export class ProductUpdateEvent {
  constructor(
    public readonly product: Product,
    public updateDto: UpdateProductDto,
  ) {}

  static eventName = 'product.update';

  static fromProduct(product: Product, updateDto: UpdateProductDto) {
    return new ProductUpdateEvent(product, updateDto);
  }
}
