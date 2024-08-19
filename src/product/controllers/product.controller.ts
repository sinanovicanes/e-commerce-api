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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Product } from '../schemas';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOkResponse({ description: 'Get product details', type: Product })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @Public()
  @Get('/:productId')
  getProduct(@Param('productId', ParseObjectIdPipe) productId: Types.ObjectId) {
    return this.productService.findPublicProductById(productId, true);
  }

  @ApiHeader({ name: 'x-merchant-id', description: 'Merchant ID' })
  @ApiCreatedResponse({
    description: 'Product created successfully',
    type: Product,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @UseGuards(MerchantAccessGuard)
  @Post()
  createProduct(
    @GetMerchant() merchant: Merchant,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.createProduct(merchant, createProductDto);
  }

  @ApiHeader({ name: 'x-merchant-id', description: 'Merchant ID' })
  @ApiOkResponse({ description: 'Product updated successfully', type: Product })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @UseGuards(MerchantAccessGuard, ProductGuard, ProductMerchantAccessGuard)
  @Patch('/:productId')
  updateProduct(
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(productId, updateProductDto);
  }

  @ApiHeader({ name: 'x-merchant-id', description: 'Merchant ID' })
  @ApiOkResponse({ description: 'Product deleted successfully', type: Product })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @UseGuards(MerchantAccessGuard, ProductGuard, ProductMerchantAccessGuard)
  @Delete('/:productId')
  deleteProduct(
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
  ) {
    return this.productService.deleteProduct(productId);
  }
}
