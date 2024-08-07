import { UpdateProductDto } from '../dtos';
import { Product } from '../schemas';

export class ProductUpdateEvent {
  static event = 'product.update';

  constructor(
    public readonly product: Product,
    public updateDto: UpdateProductDto,
  ) {}
}
