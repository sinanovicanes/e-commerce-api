import { User } from '@/user/schemas';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductReviewDto } from '../dtos';
import { ProductReview } from '../schemas';
import { Product } from '../schemas/Product';
import { ProductService } from './product.service';
import { maskField, maskFields } from '@/utils/string';

@Injectable()
export class ProductReviewService {
  @Inject() private readonly productService: ProductService;
  @InjectModel(Product.name) private readonly productModel: Model<Product>;
  @InjectModel(ProductReview.name)
  private readonly productReviewModel: Model<ProductReview>;

  async getReviews(productId: Types.ObjectId) {
    const reviews = await this.productReviewModel
      .find({
        product: productId,
      })
      .select('title description stars createdAt updatedAt')
      .populate('user', 'name lastname avatar');

    return reviews.map((review) => ({
      ...review.toJSON(),
      user: {
        fullname: maskFields(review.user.name, review.user.lastname),
        name: maskField(review.user.name),
        lastname: maskField(review.user.lastname),
        avatar: review.user.avatar,
      },
    }));
  }

  async findReviewById(productId: Types.ObjectId) {
    const product = await this.productReviewModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product review not found');
    }

    return product;
  }

  async createReview(
    user: User,
    productId: Types.ObjectId,
    createProductReviewDto: CreateProductReviewDto,
  ) {
    const productReview = new this.productReviewModel({
      ...createProductReviewDto,
      user: user._id,
      product: productId,
    });

    await productReview.save();

    return {
      message: 'Product review created successfully',
      productReviewId: productReview._id,
    };
  }

  async deleteReview(reviewId: Types.ObjectId) {
    const results = await this.productReviewModel.deleteOne({
      _id: reviewId,
    });

    if (results.deletedCount === 0) {
      throw new NotFoundException('Product review not found');
    }

    return {
      message: 'Product review deleted successfully',
    };
  }
}
