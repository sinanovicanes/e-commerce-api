import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ShoppingCart } from './schemas';
import { AddProductDto, UpdateProductQuantityDto } from './dtos';
import { adjustDate } from '@/utils/date';
import { Product } from '@/product/schemas';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CartAddEvent,
  CartRemoveEvent,
  CartClearEvent,
  CartUpdateQuantityEvent,
} from './events';

@Injectable()
export class ShoppingCartService {
  @Inject() private readonly eventEmitter: EventEmitter2;
  @InjectModel(ShoppingCart.name)
  private readonly shoppingCartModel: Model<ShoppingCart>;

  async findCart(userId: Types.ObjectId) {
    const cart = await this.shoppingCartModel.findOne({ user: userId });

    if (!cart) {
      throw new NotFoundException('Shopping cart not found');
    }

    return cart;
  }

  async getCart(userId: Types.ObjectId) {
    const cart = await this.findCart(userId);
    const total = await cart.getTotalPrice();

    return {
      ...cart.toJSON(),
      total,
    };
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

    this.eventEmitter.emit(
      CartAddEvent.event,
      new CartAddEvent(cart, productId, quantity),
    );

    return {
      ...cart.toJSON(),
      total,
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

    this.eventEmitter.emit(
      CartRemoveEvent.event,
      new CartRemoveEvent(cart, productId.toString()),
    );

    return {
      ...cart.toJSON(),
      total,
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

    this.eventEmitter.emit(
      CartUpdateQuantityEvent.event,
      new CartUpdateQuantityEvent(cart, productId, quantity),
    );

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

    this.eventEmitter.emit(CartClearEvent.event, new CartClearEvent(cart));

    return { message: 'Shopping cart cleared', cart };
  }
}
