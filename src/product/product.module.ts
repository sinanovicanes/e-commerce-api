import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductDefinition } from './schemas';

@Module({
  imports: [MongooseModule.forFeature([ProductDefinition])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
