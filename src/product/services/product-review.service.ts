import { User } from '@/user/schemas';
import { maskField, maskFields } from '@/utils/string';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductReviewDto } from '../dtos';
import { ProductReview } from '../schemas';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProductReviewCreateEvent, ProductReviewDeleteEvent } from '../events';

@Injectable()
export class ProductReviewService {
  @Inject() private readonly eventEmitter: EventEmitter2;
  @InjectModel(ProductReview.name)
  private readonly productReviewModel: Model<ProductReview>;

  async findReviewById(
    reviewId: Types.ObjectId,
  ): Promise<ProductReview | null> {
    return this.productReviewModel.findById(reviewId);
  }

  async getReviewById(reviewId: Types.ObjectId): Promise<ProductReview> {
    const review = await this.findReviewById(reviewId);

    if (!review) {
      throw new NotFoundException('Product review not found');
    }

    return review;
  }

  async getProductReviews(productId: Types.ObjectId) {
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

  async createReview(
    user: User,
    productId: Types.ObjectId,
    createProductReviewDto: CreateProductReviewDto,
  ) {
    const review = new this.productReviewModel({
      ...createProductReviewDto,
      user: user._id,
      product: productId,
    });

    await review.save();

    this.eventEmitter.emit(
      ProductReviewCreateEvent.event,
      new ProductReviewCreateEvent(review),
    );

    return {
      message: 'Product review created successfully',
      review,
    };
  }

  async deleteReview(reviewId: Types.ObjectId) {
    const review = await this.productReviewModel.findByIdAndDelete(reviewId);

    if (!review) {
      throw new NotFoundException('Product review not found');
    }

    this.eventEmitter.emit(
      ProductReviewDeleteEvent.event,
      new ProductReviewDeleteEvent(review),
    );

    return {
      message: 'Review deleted successfully',
      review,
    };
  }
}
