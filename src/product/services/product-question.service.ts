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

  async findQuestionById(
    questionId: Types.ObjectId,
  ): Promise<ProductQuestion | null> {
    return this.productQuestionModel.findById(questionId);
  }

  async getQuestionById(questionId: Types.ObjectId): Promise<ProductQuestion> {
    const question = await this.findQuestionById(questionId);

    if (!question) {
      throw new NotFoundException('Product question not found');
    }

    return question;
  }

  async getProductQuestions(
    productId: Types.ObjectId,
  ): Promise<ProductQuestion[]> {
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

  async createQuestion(
    user: User,
    productId: Types.ObjectId,
    createProductQuestionDto: CreateProductQuestionDto,
  ): Promise<ProductQuestion> {
    const productQuestion = new this.productQuestionModel({
      ...createProductQuestionDto,
      product: productId,
      user: user._id,
    });

    await productQuestion.save();

    this.eventEmitter.emit(
      ProductQuestionCreateEvent.event,
      new ProductQuestionCreateEvent(productQuestion),
    );

    return productQuestion;
  }

  async answerQuestion(
    merchant: Merchant,
    questionId: Types.ObjectId,
    answerProductQuestionDto: AnswerProductQuestionDto,
  ): Promise<ProductQuestion> {
    const { answer } = answerProductQuestionDto;
    const productQuestion = await this.getQuestionById(questionId);

    if (productQuestion.answer) {
      throw new ConflictException('Question already answered');
    }

    productQuestion.answeredAt = new Date();
    productQuestion.answeredBy = merchant._id as Types.ObjectId;
    productQuestion.answer = answer;

    await productQuestion.save();

    this.eventEmitter.emit(
      ProductQuestionUpdateEvent.event,
      new ProductQuestionUpdateEvent(productQuestion),
    );

    return productQuestion;
  }

  async deleteQuestion(questionId: Types.ObjectId): Promise<ProductQuestion> {
    const question =
      await this.productQuestionModel.findByIdAndDelete(questionId);

    if (!question) {
      throw new NotFoundException('Product question not found');
    }

    this.eventEmitter.emit(
      ProductQuestionDeleteEvent.event,
      new ProductQuestionDeleteEvent(question),
    );

    return question;
  }
}
