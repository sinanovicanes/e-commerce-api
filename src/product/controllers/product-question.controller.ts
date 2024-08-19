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
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProductQuestion } from '../schemas';

@ApiTags('product-questions')
@ApiCookieAuth()
@ApiNotFoundResponse({ description: 'Product not found' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(ProductGuard)
@Controller('products/:productId/questions')
export class ProductQuestionController {
  constructor(
    private readonly productQuestionService: ProductQuestionService,
  ) {}

  @ApiOkResponse({
    description: 'Get product questions',
    type: [ProductQuestion],
  })
  @Public()
  @Get()
  getQuestion(
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
  ) {
    return this.productQuestionService.getProductQuestions(productId);
  }

  @ApiCreatedResponse({
    description: 'Question created successfully',
    type: ProductQuestion,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
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

  @ApiHeader({ name: 'x-merchant-id', description: 'Merchant ID' })
  @ApiCreatedResponse({
    description: 'Question answered successfully',
    type: ProductQuestion,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
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

  @ApiOkResponse({
    description: 'Question deleted successfully',
    type: ProductQuestion,
  })
  @UseGuards(ProductQuestionAccessGuard)
  @Delete('/:questionId')
  deleteQuestion(
    @Param('questionId', ParseObjectIdPipe) questionId: Types.ObjectId,
  ) {
    return this.productQuestionService.deleteQuestion(questionId);
  }
}
