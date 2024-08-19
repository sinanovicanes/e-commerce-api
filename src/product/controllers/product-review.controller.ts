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
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProductReview } from '../schemas';
@ApiTags('product-reviews')
@ApiCookieAuth()
@ApiNotFoundResponse({ description: 'Product not found' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(ProductGuard)
@Controller('products/:productId/reviews')
export class ProductReviewController {
  constructor(private readonly productReviewService: ProductReviewService) {}

  @ApiOkResponse({
    description: 'Get product reviews',
    type: [ProductReview],
  })
  @Public()
  @Get()
  getReview(@Param('productId', ParseObjectIdPipe) productId: Types.ObjectId) {
    return this.productReviewService.getProductReviews(productId);
  }
  @ApiCreatedResponse({
    description: 'Review created successfully',
    type: ProductReview,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
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
  @ApiOkResponse({
    description: 'Review deleted successfully',
    type: ProductReview,
  })
  @UseGuards(ProductReviewAccessGuard)
  @Delete('/:reviewId')
  deleteReview(@Param('reviewId', ParseObjectIdPipe) reviewId: Types.ObjectId) {
    return this.productReviewService.deleteReview(reviewId);
  }
}
