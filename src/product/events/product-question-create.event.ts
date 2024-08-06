import { ProductQuestion } from '../schemas';

export class ProductQuestionCreateEvent {
  constructor(public readonly question: ProductQuestion) {}

  static eventName = 'product.question.create';

  static fromQuestion(question: ProductQuestion) {
    return new ProductQuestionCreateEvent(question);
  }
}
