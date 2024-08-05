import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ShoppingCart } from './schemas';
import { AddProductDto, UpdateProductQuantityDto } from './dtos';
import { adjustDate } from '@/utils/date';
import { Product } from '@/product/schemas';

@Injectable()
export class ShoppingCartService {
  @InjectModel(ShoppingCart.name)
  private readonly shoppingCartModel: Model<ShoppingCart>;

  async findCart(userId: Types.ObjectId) {
    const cart = await this.shoppingCartModel.findOne({ user: userId });

    if (!cart) {
      throw new NotFoundException('Shopping cart not found');
    }

    return cart;
  }

  async addProduct(userId: Types.ObjectId, addProductDto: AddProductDto) {
    const { productId, quantity } = addProductDto;

    let cart = await this.shoppingCartModel.findOneAndUpdate(
      { user: userId, 'products.product': productId },
      {
        $inc: { 'products.$.quantity': quantity },
        expiresAt: adjustDate({ weeks: 2 }),
      },
      { new: true },
    );

    if (!cart) {
      cart = await this.shoppingCartModel.findOneAndUpdate(
        { user: userId },
        {
          $push: { products: { product: productId, quantity } },
          expiresAt: adjustDate({ weeks: 2 }),
        },
        { new: true, upsert: true },
      );
    }

    const total = await cart.getTotalPrice();

    return {
      total,
      ...cart.toJSON(),
    };
  }

  async removeProduct(userId: Types.ObjectId, productId: Types.ObjectId) {
    const cart = await this.shoppingCartModel.findOneAndUpdate(
      { user: userId, 'products.product': productId },
      {
        $pull: { products: { product: productId } },
        expiresAt: adjustDate({ weeks: 2 }),
      },
      { new: true },
    );

    if (!cart) {
      throw new NotFoundException('Product not found in the shopping cart');
    }

    const total = await cart.getTotalPrice();

    return {
      total,
      ...cart.toJSON(),
    };
  }

  async updateProductQuantity(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
    updateQuantityDto: UpdateProductQuantityDto,
  ) {
    const { quantity } = updateQuantityDto;

    const cart = await this.shoppingCartModel.findOneAndUpdate(
      { user: userId, 'products.product': productId },
      {
        $set: { 'products.$.quantity': quantity },
        expiresAt: adjustDate({ weeks: 2 }),
      },
      { new: true },
    );

    if (!cart) {
      throw new NotFoundException('Product not found in cart');
    }

    const total = await cart.getTotalPrice();

    return {
      ...cart.toJSON(),
      total,
    };
  }

  async deleteCart(userId: Types.ObjectId) {
    const cart = await this.shoppingCartModel.findOneAndDelete({
      user: userId,
    });

    if (!cart) {
      throw new NotFoundException('Shopping cart not found');
    }

    return { message: 'Shopping cart cleared', cart };
  }
}
