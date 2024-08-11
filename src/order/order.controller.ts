import { User } from '@/user/schemas';
import { GetUser } from '@/utils/decorators';
import { ParseObjectIdPipe } from '@/utils/pipes';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateOrderDto } from './dtos';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/:orderId')
  async getOrder(@Param('orderId', ParseObjectIdPipe) orderId: Types.ObjectId) {
    return this.orderService.getOrderById(orderId);
  }

  @Post()
  async createOrder(
    @GetUser() user: User,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const order = await this.orderService.createOrder(user, createOrderDto);

    return { message: 'Order created successfully', order };
  }

  @Post('/cart')
  async createOrderFromCart(@GetUser() user: User) {
    const order = await this.orderService.createOrderFromCart(user);

    return { message: 'Order created successfully', order };
  }
}
