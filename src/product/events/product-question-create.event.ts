import { ProductQuestion } from '../schemas';

export class ProductQuestionCreateEvent {
  static event = 'product.question.create';

  constructor(public readonly question: ProductQuestion) {}
}
