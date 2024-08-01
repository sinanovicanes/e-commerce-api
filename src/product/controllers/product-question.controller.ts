import { Public } from '@/auth/decorators';
import { User } from '@/user/schemas';
import { GetUser } from '@/utils/decorators';
import { ParseObjectIdPipe } from '@/utils/pipes';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateProductQuestionDto } from '../dtos';
import { ProductQuestionService } from '../services';

@Controller('product/questions')
export class ProductQuestionController {
  constructor(
    private readonly productQuestionService: ProductQuestionService,
  ) {}

  @Public()
  @Get('/:productId')
  getProduct(@Param('productId', ParseObjectIdPipe) productId: Types.ObjectId) {
    return this.productQuestionService.getProductQuestions(productId);
  }

  @Post('create')
  createProduct(
    @GetUser() user: User,
    @Body() createProductQuestionDto: CreateProductQuestionDto,
  ) {
    return this.productQuestionService.createProductQuestion(
      user,
      createProductQuestionDto,
    );
  }

  @Delete('delete/:productId')
  deleteProduct(
    @GetUser() user: User,
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
  ) {
    return this.productQuestionService.deleteProductQuestion(user, productId);
  }
}
