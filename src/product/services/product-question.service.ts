import { User } from '@/user/schemas';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductQuestionDto, CreateProductReviewDto } from '../dtos';
import { ProductQuestion } from '../schemas';
import { Product } from '../schemas/Product';
import { ProductService } from './product.service';

@Injectable()
export class ProductQuestionService {
  @Inject() private readonly productService: ProductService;
  @InjectModel(ProductQuestion.name)
  private readonly productQuestionModel: Model<ProductQuestion>;

  async getProductQuestions(productId: Types.ObjectId) {
    const isProductExist = await this.productService.isProductExists(productId);

    if (!isProductExist) {
      throw new NotFoundException('Product not found');
    }

    const productQuestions = await this.productQuestionModel
      .find({
        product: productId,
        parent: null,
      })
      .select('question answer answeredAt createdAt updatedAt')
      .populate('answeredBy', 'name')
      .populate('user', 'name avatar');

    return productQuestions;
  }

  async findProductQuestionById(productId: Types.ObjectId) {
    const product = await this.productQuestionModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product review not found');
    }

    return product;
  }

  async createProductQuestion(
    user: User,
    createProductQuestionDto: CreateProductQuestionDto,
  ) {
    const { productId: _productId, ...dto } = createProductQuestionDto;
    const productId = new Types.ObjectId(_productId);
    const product = await this.productService.getProductById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const productQuestion = new this.productQuestionModel({
      ...dto,
      product: product._id,
      user: user._id,
    });

    await productQuestion.save();

    return {
      message: 'Product question created successfully',
      productQuestionId: productQuestion._id,
    };
  }

  async deleteProductQuestion(user: User, productId: Types.ObjectId) {
    const results = await this.productQuestionModel.deleteOne({
      _id: productId,
      user: user._id,
    });

    if (results.deletedCount === 0) {
      throw new NotFoundException('Product question not found');
    }

    return {
      message: 'Product question deleted successfully',
    };
  }
}
