import { User } from '@/user/schemas';
import { GetUser } from '@/utils/decorators';
import { ParseObjectIdPipe } from '@/utils/pipes';
import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { CreateOrderByCartDto, CreateOrderDto } from './dtos';
import { OrderService } from './order.service';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Order } from './schemas';

@ApiTags('orders')
@ApiCookieAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOkResponse({ description: 'List of orders', type: [Order] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/history')
  async getOrderHistory(
    @GetUser() user: User,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const history = await this.orderService.getOrderHistory(user, page, limit);

    return history;
  }

  @ApiOkResponse({ description: 'Order details', type: Order })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @Get('/:orderId')
  async getOrder(@Param('orderId', ParseObjectIdPipe) orderId: Types.ObjectId) {
    return this.orderService.getOrderById(orderId);
  }

  @ApiCreatedResponse({ description: 'Order created', type: Order })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post()
  async createOrder(
    @Req() req: Request,
    @GetUser() user: User,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const order = await this.orderService.createOrder(
      req,
      user,
      createOrderDto,
    );

    return { message: 'Order created successfully', order };
  }

  @ApiCreatedResponse({ description: 'Order created', type: Order })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('/cart')
  async createOrderFromCart(
    @Req() req: Request,
    @GetUser() user: User,
    @Body() createOrderDto: CreateOrderByCartDto,
  ) {
    const order = await this.orderService.createOrderFromCart(
      req,
      user,
      createOrderDto,
    );

    return { message: 'Order created successfully', order };
  }
}
