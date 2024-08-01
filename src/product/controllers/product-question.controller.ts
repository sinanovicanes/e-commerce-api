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
import { CreateProductQuestionDto, AnswerProductQuestionDto } from '../dtos';
import { ProductQuestionService } from '../services';
import { MerchantAccessGuard } from '@/merchant/guards';
import { GetMerchant } from '@/merchant/decorators';
import { Merchant } from '@/merchant/schemas';

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

  @UseGuards(MerchantAccessGuard)
  @Post('answer')
  answerProductQuestion(
    @GetMerchant() merchant: Merchant,
    @Body() answerProductQuestionDto: AnswerProductQuestionDto,
  ) {
    return this.productQuestionService.answerProductQuestion(
      merchant,
      answerProductQuestionDto,
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
