import { Public } from '@/auth/decorators';
import { User } from '@/user/schemas';
import { GetUser } from '@/utils/decorators';
import { ParseObjectIdPipe } from '@/utils/pipes';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateProductReviewDto } from '../dtos';
import { ProductReviewService } from '../services';

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
