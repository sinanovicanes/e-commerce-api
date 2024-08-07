import { ProductQuestion } from '../schemas';

export class ProductQuestionDeleteEvent {
  static event = 'product.question.delete';

  constructor(public readonly question: ProductQuestion) {}
}
