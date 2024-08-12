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

  async isProductExists(productId: Types.ObjectId | string): Promise<boolean> {
    const product = await this.productModel.exists({ _id: productId });

    return !!product;
  }

  async isProductsExists(
    productIds: Types.ObjectId[] | string[],
  ): Promise<boolean> {
    const products = await this.productModel.countDocuments(
      {
        _id: { $in: productIds },
      },
      { limit: productIds.length },
    );

    return products === productIds.length;
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

  async createProduct(
    merchant: Merchant,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
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

    return product;
  }

  async updateProduct(
    productId: Types.ObjectId,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
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

    return product;
  }

  async deleteProduct(productId: Types.ObjectId): Promise<Product> {
    const product = await this.productModel.findByIdAndDelete(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    this.eventEmitter.emit(
      ProductDeleteEvent.event,
      new ProductDeleteEvent(product),
    );

    return product;
  }

  async getProductPrices(productIds: Types.ObjectId[] | string[]) {
    const products = await this.productModel.find(
      { _id: { $in: productIds } },
      { price: 1 },
    );

    return products.reduce(
      (acc, product) => {
        acc[product._id as string] = product.price;
        return acc;
      },
      {} as Record<string, number>,
    );
  }
}
