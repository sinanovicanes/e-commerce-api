import { ProductQuestion } from '../schemas';

export class ProductQuestionDeleteEvent {
  constructor(public readonly question: ProductQuestion) {}

  static eventName = 'product.question.delete';

  static fromQuestion(question: ProductQuestion) {
    return new ProductQuestionDeleteEvent(question);
  }
}
