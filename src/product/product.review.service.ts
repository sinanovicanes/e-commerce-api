import { User } from '@/user/schemas';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductReviewDto } from './dtos';
import { ProductReview } from './schemas';
import { Product } from './schemas/Product';
import { ProductService } from './product.service';

@Injectable()
export class ProductReviewService {
  @Inject() private readonly productService: ProductService;
  @InjectModel(Product.name) private readonly productModel: Model<Product>;
  @InjectModel(ProductReview.name)
  private readonly productReviewModel: Model<ProductReview>;

  async getProductReviews(productId: Types.ObjectId) {
    const isProductExist = await this.productService.isProductExists(productId);

    if (!isProductExist) {
      throw new NotFoundException('Product not found');
    }

    const productReviews = await this.productReviewModel
      .find({
        product: productId,
        parent: null,
      })
      .select('title description stars createdAt updatedAt')
      .populate({
        path: 'replies',
        model: 'ProductReview',
        select: 'title description stars createdAt updatedAt',
        populate: [
          {
            path: 'user',
            select: 'name avatar',
          },
        ],
        options: { sort: { createdAt: 1 }, limit: 1 },
      })
      .populate('user', 'name avatar');

    return productReviews;
  }

  async findProductReviewById(productId: Types.ObjectId) {
    const product = await this.productReviewModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product review not found');
    }

    return product;
  }

  async createProductReview(
    user: User,
    createProductReviewDto: CreateProductReviewDto,
  ) {
    if (createProductReviewDto.parentId) {
      return this.createProductReviewReply(user, createProductReviewDto);
    }

    const productId = new Types.ObjectId(createProductReviewDto.productId);
    const isProductExist = await this.productService.isProductExists(productId);

    if (!isProductExist) {
      throw new NotFoundException('Product not found');
    }

    const { productId: _productId, ...dto } = createProductReviewDto;

    const productReview = new this.productReviewModel({
      ...dto,
      user: user._id,
      product: productId,
    });

    await productReview.save();

    return {
      message: 'Product review created successfully',
      productReviewId: productReview._id,
    };
  }

  async createProductReviewReply(
    user: User,
    createProductReviewDto: CreateProductReviewDto,
  ) {
    const productId = new Types.ObjectId(createProductReviewDto.productId);
    const isProductExist = await this.productService.isProductExists(productId);

    if (!isProductExist) {
      throw new NotFoundException('Product not found');
    }

    const parentId = new Types.ObjectId(createProductReviewDto.parentId);
    const parentProductReview = await this.findProductReviewById(parentId);

    if (!parentProductReview) {
      throw new NotFoundException('Parent product review not found');
    }

    const {
      productId: _productId,
      parentId: _parentId,
      ...dto
    } = createProductReviewDto;
    const productReview = new this.productReviewModel({
      ...dto,
      user: user._id,
      product: productId,
      parent: parentId,
    });

    await productReview.save();

    (parentProductReview.replies as Types.ObjectId[]).push(
      productReview._id as Types.ObjectId,
    );
    await parentProductReview.save();

    return {
      message: 'Product review reply created successfully',
      productReviewId: productReview._id,
    };
  }

  async deleteProduct(user: User, productId: Types.ObjectId) {
    const results = await this.productReviewModel.deleteOne({
      _id: productId,
      user: user._id,
    });

    if (results.deletedCount === 0) {
      throw new NotFoundException('Product review not found');
    }

    return {
      message: 'Product review deleted successfully',
    };
  }
}
