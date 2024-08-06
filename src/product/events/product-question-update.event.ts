import { ProductQuestion } from '../schemas';

export class ProductQuestionUpdateEvent {
  constructor(public readonly question: ProductQuestion) {}

  static eventName = 'product.question.update';

  static fromQuestion(question: ProductQuestion) {
    return new ProductQuestionUpdateEvent(question);
  }
}
