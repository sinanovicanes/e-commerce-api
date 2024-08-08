import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { Types } from 'mongoose';
import { GetUser } from '@/utils/decorators';
import { AddProductDto, UpdateProductQuantityDto } from './dtos';
import { ProductGuard } from '@/product/guards';
import { ParseObjectIdPipe } from '@/utils/pipes';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Get()
  async getShoppingCart(@GetUser('_id') userId: Types.ObjectId) {
    return this.shoppingCartService.getUserCart(userId);
  }

  @Delete()
  async clearShoppingCart(@GetUser('_id') userId: Types.ObjectId) {
    return this.shoppingCartService.deleteCart(userId);
  }

  @Post()
  @UseGuards(ProductGuard)
  async addProductToShoppingCart(
    @GetUser('_id') userId: Types.ObjectId,
    @Body() addProductDto: AddProductDto,
  ) {
    return this.shoppingCartService.addProduct(userId, addProductDto);
  }

  @Patch('/:productId')
  async updateProductQuantity(
    @GetUser('_id') userId: Types.ObjectId,
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @Body() updateQuantityDto: UpdateProductQuantityDto,
  ) {
    return this.shoppingCartService.updateProductQuantity(
      userId,
      productId,
      updateQuantityDto,
    );
  }

  @Delete('/:productId')
  async removeProductFromShoppingCart(
    @GetUser('_id') userId: Types.ObjectId,
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
  ) {
    return this.shoppingCartService.removeProduct(userId, productId);
  }
}
