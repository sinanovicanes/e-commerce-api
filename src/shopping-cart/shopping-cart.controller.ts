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
import {
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ShoppingCart } from './schemas';

@ApiTags('cart')
@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @ApiOkResponse({
    description: 'Get shopping cart details',
    type: ShoppingCart,
  })
  @ApiNotFoundResponse({ description: 'Shopping cart not found' })
  @Get()
  async getShoppingCart(@GetUser('_id') userId: Types.ObjectId) {
    return this.shoppingCartService.getUserCart(userId);
  }

  @ApiOkResponse({
    description: 'Shopping cart cleared successfully',
    type: ShoppingCart,
  })
  @ApiNotFoundResponse({ description: 'Shopping cart not found' })
  @Delete()
  clearShoppingCart(@GetUser('_id') userId: Types.ObjectId) {
    return this.shoppingCartService.deleteCart(userId);
  }

  @ApiOkResponse({
    description: 'Product added to shopping cart successfully',
    type: ShoppingCart,
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @Post()
  @UseGuards(ProductGuard)
  addProductToShoppingCart(
    @GetUser('_id') userId: Types.ObjectId,
    @Body() addProductDto: AddProductDto,
  ) {
    return this.shoppingCartService.addProduct(userId, addProductDto);
  }

  @ApiOkResponse({
    description: 'Product quantity updated successfully',
    type: ShoppingCart,
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @Patch('/:productId')
  updateProductQuantity(
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

  @ApiOkResponse({
    description: 'Product removed from shopping cart successfully',
    type: ShoppingCart,
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @Delete('/:productId')
  async removeProductFromShoppingCart(
    @GetUser('_id') userId: Types.ObjectId,
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
  ) {
    return this.shoppingCartService.removeProduct(userId, productId);
  }
}
