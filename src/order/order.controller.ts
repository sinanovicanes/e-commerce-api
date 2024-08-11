import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { GetUser } from '@/utils/decorators';
import { User } from '@/user/schemas';
import { CreateOrderDto } from './dtos';
import { ParseObjectIdPipe } from '@/utils/pipes';
import { Types } from 'mongoose';

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
}
