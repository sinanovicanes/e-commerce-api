import { User } from '@/user/schemas';
import { maskField, maskFields } from '@/utils/string';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductReviewDto } from '../dtos';
import { ProductReview } from '../schemas';

@Injectable()
export class ProductReviewService {
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
    const review = await this.productReviewModel.findByIdAndDelete(reviewId);

    if (!review) {
      throw new NotFoundException('Product review not found');
    }

    return {
      message: 'Review deleted successfully',
      review,
    };
  }
}
