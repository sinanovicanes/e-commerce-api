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
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ProductQuestionCreateEvent,
  ProductQuestionDeleteEvent,
  ProductQuestionUpdateEvent,
} from '../events';

@Injectable()
export class ProductQuestionService {
  @Inject() private readonly eventEmitter: EventEmitter2;
  @InjectModel(ProductQuestion.name)
  private readonly productQuestionModel: Model<ProductQuestion>;

  async getQuestions(productId: Types.ObjectId) {
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
    const productQuestion = new this.productQuestionModel({
      ...createProductQuestionDto,
      product: productId,
      user: user._id,
    });

    await productQuestion.save();

    this.eventEmitter.emit(
      ProductQuestionCreateEvent.eventName,
      ProductQuestionCreateEvent.fromQuestion(productQuestion),
    );

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

    this.eventEmitter.emit(
      ProductQuestionUpdateEvent.eventName,
      ProductQuestionUpdateEvent.fromQuestion(productQuestion),
    );

    return {
      message: 'Product question answered successfully',
    };
  }

  async deleteQuestion(questionId: Types.ObjectId) {
    const question =
      await this.productQuestionModel.findByIdAndDelete(questionId);

    if (!question) {
      throw new NotFoundException('Product question not found');
    }

    this.eventEmitter.emit(
      ProductQuestionDeleteEvent.eventName,
      ProductQuestionDeleteEvent.fromQuestion(question),
    );

    return {
      message: 'Question deleted successfully',
      question,
    };
  }
}
