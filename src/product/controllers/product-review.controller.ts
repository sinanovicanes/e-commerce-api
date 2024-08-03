import { Public } from '@/auth/decorators';
import { User } from '@/user/schemas';
import { GetUser } from '@/utils/decorators';
import { ParseObjectIdPipe } from '@/utils/pipes';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateProductReviewDto } from '../dtos';
import { ProductReviewService } from '../services';
import { ProductGuard, ProductReviewAccessGuard } from '../guards';

@UseGuards(ProductGuard)
@Controller('products/:productId/reviews')
export class ProductReviewController {
  constructor(private readonly productReviewService: ProductReviewService) {}

  @Public()
  @Get()
  getProduct(@Param('productId', ParseObjectIdPipe) productId: Types.ObjectId) {
    return this.productReviewService.getReviews(productId);
  }

  @Post()
  createProduct(
    @GetUser() user: User,
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @Body() createProductReviewDto: CreateProductReviewDto,
  ) {
    return this.productReviewService.createReview(
      user,
      productId,
      createProductReviewDto,
    );
  }

  @UseGuards(ProductReviewAccessGuard)
  @Delete('/:reviewId')
  deleteProduct(
    @Param('reviewId', ParseObjectIdPipe) reviewId: Types.ObjectId,
  ) {
    return this.productReviewService.deleteReview(reviewId);
  }
}
