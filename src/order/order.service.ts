import { ProductService } from '@/product/services';
import { User } from '@/user/schemas';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderDto } from './dtos';
import { Order } from './schemas';

@Injectable()
export class OrderService {
  @Inject() private readonly productService: ProductService;
  @InjectModel(Order.name) private readonly orderModel: Model<Order>;

  async findOrderById(orderId: string | Types.ObjectId): Promise<Order | null> {
    return this.orderModel.findById(orderId);
  }

  async getOrderById(orderId: string | Types.ObjectId): Promise<Order> {
    const order = await this.orderModel.findById(orderId).populate({
      path: 'products.product',
      select: 'name price',
      model: 'Product',
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async createOrder(
    target: User | Types.ObjectId,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const userId = target instanceof User ? target._id : target;
    const productIds = createOrderDto.products.map(
      (product) => product.product,
    );

    // Check if there are duplicate products
    if (new Set(productIds).size !== productIds.length) {
      throw new UnprocessableEntityException('Duplicate products found');
    }

    const productPrices =
      await this.productService.getProductPrices(productIds);

    const products = createOrderDto.products.map((product) => {
      const price = productPrices[product.product];

      // If the product price is not found, throw an exception
      if (!price) {
        throw new UnprocessableEntityException('Product not found');
      }

      const totalPrice = price * product.quantity;

      return {
        ...product,
        price: totalPrice,
      };
    });
    const order = new this.orderModel({ products, user: userId });

    order.save();

    return order;
  }
}
