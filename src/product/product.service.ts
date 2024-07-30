import { Merchant } from '@/merchant/schemas';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/Product';
import { Model, Types } from 'mongoose';
import { UpdateProductDto } from './dtos';

@Injectable()
export class ProductService {
  @InjectModel(Product.name) private readonly productModel: Model<Product>;

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

  async getProductById(productId: Types.ObjectId): Promise<Product> {
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
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

    const product = await this.getProductById(productId);

    await product.updateOne(updateProductDto);

    return { message: 'Product updated successfully' };
  }

  async deleteProduct(productId: Types.ObjectId) {
    const results = await this.productModel.deleteOne({ _id: productId });

    if (results.deletedCount === 0) {
      throw new NotFoundException('Product not found');
    }

    return { message: 'Product deleted successfully' };
  }
}
