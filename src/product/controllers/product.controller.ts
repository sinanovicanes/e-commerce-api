import { Public } from '@/auth/decorators';
import { GetMerchant } from '@/merchant/decorators';
import { MerchantAccessGuard } from '@/merchant/guards';
import { Merchant } from '@/merchant/schemas';
import { ParseObjectIdPipe } from '@/utils/pipes';
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
import { Types } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from '../dtos';
import { ProductService } from '../services';
import { ProductGuard, ProductMerchantAccessGuard } from '../guards';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get('/:productId')
  getProduct(@Param('productId', ParseObjectIdPipe) productId: Types.ObjectId) {
    return this.productService.findPublicProductById(productId, true);
  }

  @UseGuards(MerchantAccessGuard)
  @Post()
  createProduct(
    @GetMerchant() merchant: Merchant,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.createProduct(merchant, createProductDto);
  }

  @UseGuards(MerchantAccessGuard, ProductGuard, ProductMerchantAccessGuard)
  @Patch('/:productId')
  updateProduct(
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(productId, updateProductDto);
  }

  @UseGuards(MerchantAccessGuard, ProductGuard, ProductMerchantAccessGuard)
  @Delete('/:productId')
  async deleteProduct(
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
  ) {
    const review = await this.productService.deleteProduct(productId);

    return { message: 'Product deleted successfully', review };
  }
}
