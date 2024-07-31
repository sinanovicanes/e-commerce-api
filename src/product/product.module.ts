import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductDefinition, ProductReviewDefinition } from './schemas';
import { ProductReviewService } from './product.review.service';
import { ProductReviewController } from './product-review.controller';

@Module({
  imports: [
    MongooseModule.forFeature([ProductDefinition, ProductReviewDefinition]),
  ],
  controllers: [ProductController, ProductReviewController],
  providers: [ProductService, ProductReviewService],
})
export class ProductModule {}
