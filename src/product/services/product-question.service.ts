import { Merchant } from '@/merchant/schemas';
import { User } from '@/user/schemas';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AnswerProductQuestionDto, CreateProductQuestionDto } from '../dtos';
import { ProductQuestion } from '../schemas';
import { ProductService } from './product.service';

@Injectable()
export class ProductQuestionService {
  @Inject() private readonly productService: ProductService;
  @InjectModel(ProductQuestion.name)
  private readonly productQuestionModel: Model<ProductQuestion>;

  async getQuestions(productId: Types.ObjectId) {
    const isProductExist = await this.productService.isProductExists(productId);

    if (!isProductExist) {
      throw new NotFoundException('Product not found');
    }

    const productQuestions = await this.productQuestionModel
      .find({
        product: productId,
        parent: null,
      })
      .select('question answer answeredAt createdAt updatedAt')
      .populate('answeredBy', 'name')
      .populate('user', 'name avatar');

    return productQuestions;
  }

  async findQuestionById(productId: Types.ObjectId) {
    const product = await this.productQuestionModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product question not found');
    }

    return product;
  }

  async createQuestion(
    user: User,
    productId: Types.ObjectId,
    createProductQuestionDto: CreateProductQuestionDto,
  ) {
    const product = await this.productService.getProductById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const productQuestion = new this.productQuestionModel({
      ...createProductQuestionDto,
      product: product._id,
      user: user._id,
    });

    await productQuestion.save();

    return {
      message: 'Product question created successfully',
      productQuestionId: productQuestion._id,
    };
  }

  async answerQuestion(
    merchant: Merchant,
    questionId: Types.ObjectId,
    answerProductQuestionDto: AnswerProductQuestionDto,
  ) {
    const { answer } = answerProductQuestionDto;
    const productQuestion = await this.findQuestionById(questionId);

    if (productQuestion.answer) {
      throw new ConflictException('Question already answered');
    }

    productQuestion.answeredAt = new Date();
    productQuestion.answeredBy = merchant._id as Types.ObjectId;
    productQuestion.answer = answer;

    await productQuestion.save();

    return {
      message: 'Product question answered successfully',
    };
  }

  async deleteQuestion(questionId: Types.ObjectId) {
    const results = await this.productQuestionModel.deleteOne({
      _id: questionId,
    });

    if (results.deletedCount === 0) {
      throw new NotFoundException('Product question not found');
    }

    return {
      message: 'Product question deleted successfully',
    };
  }
}
