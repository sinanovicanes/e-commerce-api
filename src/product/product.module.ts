import { Global, Module } from '@nestjs/common';
import {
  ProductService,
  ProductReviewService,
  ProductQuestionService,
} from './services';
import { ProductController, ProductReviewController } from './controllers';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductDefinition,
  ProductQuestionDefinition,
  ProductReviewDefinition,
} from './schemas';
import { ProductQuestionController } from './controllers/product-question.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      ProductDefinition,
      ProductReviewDefinition,
      ProductQuestionDefinition,
    ]),
  ],
  controllers: [
    ProductController,
    ProductReviewController,
    ProductQuestionController,
  ],
  providers: [ProductService, ProductReviewService, ProductQuestionService],
  exports: [ProductService],
})
export class ProductModule {}
