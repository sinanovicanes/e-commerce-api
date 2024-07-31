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
import { CreateProductReviewDto, UpdateProductDto } from './dtos';
import { ParseObjectIdPipe } from '@/utils/pipes';
import { Types } from 'mongoose';
import { Public } from '@/auth/decorators';
import { ProductReviewService } from './product.review.service';
import { GetUser } from '@/utils/decorators';
import { User } from '@/user/schemas';

@Controller('product/reviews')
export class ProductReviewController {
  constructor(private readonly productReviewService: ProductReviewService) {}

  @Public()
  @Get('/:productId')
  getProduct(@Param('productId', ParseObjectIdPipe) productId: Types.ObjectId) {
    return this.productReviewService.getProductReviews(productId);
  }

  @Post('create')
  createProduct(
    @GetUser() user: User,
    @Body() createProductReviewDto: CreateProductReviewDto,
  ) {
    return this.productReviewService.createProductReview(
      user,
      createProductReviewDto,
    );
  }

  @Delete('delete/:productId')
  deleteProduct(
    @GetUser() user: User,
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
  ) {
    return this.productReviewService.deleteProduct(user, productId);
  }
}
