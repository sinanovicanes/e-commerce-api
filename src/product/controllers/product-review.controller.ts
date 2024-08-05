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
  getReview(@Param('productId', ParseObjectIdPipe) productId: Types.ObjectId) {
    return this.productReviewService.getReviews(productId);
  }

  @Post()
  createReview(
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
  deleteReview(@Param('reviewId', ParseObjectIdPipe) reviewId: Types.ObjectId) {
    return this.productReviewService.deleteReview(reviewId);
  }
}
