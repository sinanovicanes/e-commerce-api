import { ProductQuestion } from '../schemas';

export class ProductQuestionUpdateEvent {
  static event = 'product.question.update';

  constructor(public readonly question: ProductQuestion) {}
}
