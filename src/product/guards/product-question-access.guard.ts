import { User } from '@/user/schemas';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { ProductQuestionService } from '../services';
import { Product } from '../schemas';

@Injectable()
export class ProductQuestionAccessGuard implements CanActivate {
  @Inject() private readonly productQuestionService: ProductQuestionService;

  private extractProductQuestionIdFromRequest(
    request: Request,
  ): Types.ObjectId | null {
    const questionId =
      request.params.questionId ??
      request.body.questionId ??
      request.query.questionId;

    if (!questionId) {
      return null;
    }

    return Types.ObjectId.isValid(questionId)
      ? new Types.ObjectId(questionId)
      : null;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const product = request.product as Product;

    if (!user || !product) {
      return false;
    }

    const questionId = this.extractProductQuestionIdFromRequest(request);

    if (!questionId) {
      return false;
    }

    const question =
      await this.productQuestionService.getQuestionById(questionId);

    if (!question) {
      return false;
    }

    // Check if the question is related to the product
    if (question.product.toString() !== product._id.toString()) {
      return false;
    }

    return question.user.toString() === user._id.toString();
  }
}
