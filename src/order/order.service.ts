import { ProductService } from '@/product/services';
import { ShoppingCartService } from '@/shopping-cart/shopping-cart.service';
import { User } from '@/user/schemas';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderByCartDto, CreateOrderDto } from './dtos';
import { Order } from './schemas';
import { PaymentService } from '@/payment/payment.service';
import { Request } from 'express';

@Injectable()
export class OrderService {
  @Inject() private readonly productService: ProductService;
  @Inject() private readonly paymentService: PaymentService;
  @Inject() private readonly shoppingCartService: ShoppingCartService;
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

  async getOrderHistory(
    target: User | Types.ObjectId,
    page: number,
    limit: number,
  ): Promise<Order[]> {
    const userId = target instanceof Types.ObjectId ? target : target._id;
    const offset = (page - 1) * limit;

    return this.orderModel
      .find({ user: userId })
      .select('products status createdAt updatedAt')
      .skip(offset)
      .limit(limit)
      .populate('products.product', 'name price image');
  }

  async createOrder(
    req: Request,
    user: User,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const userId = user._id as Types.ObjectId;
    const productIds = createOrderDto.products.map(
      (product) => product.product,
    );

    // Check if there are duplicate products
    if (new Set(productIds).size !== productIds.length) {
      throw new BadRequestException('Duplicate products found');
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
    const payment = await this.paymentService.createPayment(
      req,
      user,
      order,
      createOrderDto,
    );

    order.payment = payment._id as Types.ObjectId;

    await order.save();

    return order;
  }

  async createOrderFromCart(
    req: Request,
    user: User,
    createOrderDto: CreateOrderByCartDto,
  ): Promise<Order> {
    const cart = await this.shoppingCartService.getCartByUserId(
      user._id as Types.ObjectId,
    );
    const order = await this.createOrder(req, user, {
      ...createOrderDto,
      products: cart.products.map((product) => ({
        product: (product.product as Types.ObjectId).toString(),
        quantity: product.quantity,
      })),
    });

    await cart.deleteOne();

    return order;
  }
}
