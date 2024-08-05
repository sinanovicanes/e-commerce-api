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
import {
  ProductGuard,
  ProductMerchantAccessGuard,
  ProductQuestionAccessGuard,
} from '../guards';

@UseGuards(ProductGuard)
@Controller('products/:productId/questions')
export class ProductQuestionController {
  constructor(
    private readonly productQuestionService: ProductQuestionService,
  ) {}

  @Public()
  @Get()
  getQuestion(
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
  ) {
    return this.productQuestionService.getQuestions(productId);
  }

  @Post()
  createQuestion(
    @GetUser() user: User,
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @Body() createProductQuestionDto: CreateProductQuestionDto,
  ) {
    return this.productQuestionService.createQuestion(
      user,
      productId,
      createProductQuestionDto,
    );
  }

  @UseGuards(MerchantAccessGuard, ProductMerchantAccessGuard)
  @Post('/:questionId/answer')
  answerQuestion(
    @GetMerchant() merchant: Merchant,
    @Param('questionId', ParseObjectIdPipe) questionId: Types.ObjectId,
    @Body() answerProductQuestionDto: AnswerProductQuestionDto,
  ) {
    return this.productQuestionService.answerQuestion(
      merchant,
      questionId,
      answerProductQuestionDto,
    );
  }

  @UseGuards(ProductQuestionAccessGuard)
  @Delete('/:questionId')
  deleteQuestion(
    @Param('questionId', ParseObjectIdPipe) questionId: Types.ObjectId,
  ) {
    return this.productQuestionService.deleteQuestion(questionId);
  }
}
