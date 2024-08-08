import { Merchant } from '@/merchant/schemas';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from '../dtos';
import { Product } from '../schemas';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ProductCreateEvent,
  ProductDeleteEvent,
  ProductUpdateEvent,
} from '../events';

@Injectable()
export class ProductService {
  @Inject() private readonly eventEmitter: EventEmitter2;
  @InjectModel(Product.name) private readonly productModel: Model<Product>;

  async isProductExists(productId: Types.ObjectId) {
    const product = await this.productModel.exists({ _id: productId });

    return !!product;
  }

  async findProductById(productId: Types.ObjectId): Promise<Product | null> {
    return this.productModel.findById(productId);
  }

  async getProductById(productId: Types.ObjectId): Promise<Product> {
    const product = await this.findProductById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findPublicProductById(
    productId: Types.ObjectId,
    populateMerchant = false,
  ) {
    const product = await this.getProductById(productId);

    if (!product.isPublished()) {
      throw new NotFoundException('Product not found');
    }

    if (populateMerchant) {
      await product.populate('merchant', ['name']);
    }

    return product;
  }

  async createProduct(merchant: Merchant, createProductDto: CreateProductDto) {
    const product = new this.productModel({
      ...createProductDto,
      stock: 0,
      merchant: merchant._id,
    });

    await product.save();

    this.eventEmitter.emit(
      ProductCreateEvent.event,
      new ProductCreateEvent(product),
    );

    return {
      message: 'Product created successfully',
      productId: product._id,
    };
  }

  async updateProduct(
    productId: Types.ObjectId,
    updateProductDto: UpdateProductDto,
  ) {
    if (Object.keys(updateProductDto).length === 0) {
      throw new BadRequestException(
        'At least one field must be provided to update',
      );
    }

    const product = await this.productModel.findByIdAndUpdate(
      productId,
      updateProductDto,
      { new: true },
    );

    this.eventEmitter.emit(
      ProductUpdateEvent.event,
      new ProductUpdateEvent(product, updateProductDto),
    );

    return { message: 'Product updated successfully', product };
  }

  async deleteProduct(productId: Types.ObjectId) {
    const product = await this.productModel.findByIdAndDelete(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    this.eventEmitter.emit(
      ProductDeleteEvent.event,
      new ProductDeleteEvent(product),
    );

    return { message: 'Product deleted successfully', product };
  }
}
