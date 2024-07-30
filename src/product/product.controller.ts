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
import { ProductService } from './product.service';
import { MerchantAccessGuard } from '@/merchant/guards';
import { GetMerchant } from '@/merchant/decorators';
import { Merchant } from '@/merchant/schemas';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos';
import { ParseObjectIdPipe } from '@/utils/pipes';
import { Types } from 'mongoose';
import { Public } from '@/auth/decorators';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get('/:productId')
  getProduct(@Param('productId', ParseObjectIdPipe) productId: Types.ObjectId) {
    return this.productService.findPublicProductById(productId, true);
  }

  @UseGuards(MerchantAccessGuard)
  @Post('create')
  createProduct(
    @GetMerchant() merchant: Merchant,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.createProduct(merchant, createProductDto);
  }

  @UseGuards(MerchantAccessGuard)
  @Patch('update/:productId')
  updateProduct(
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(productId, updateProductDto);
  }

  @UseGuards(MerchantAccessGuard)
  @Delete('delete/:productId')
  deleteProduct(
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
  ) {
    return this.productService.deleteProduct(productId);
  }
}
