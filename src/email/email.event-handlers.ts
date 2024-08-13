import {
  UserRegisterEvent,
  UserResetPasswordEvent,
  UserResetPasswordRequestEvent,
} from '@/auth/events';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from './email.service';
import { EmailType } from './enums';
import { OrderCreatedEvent } from '@/order/events';
import { User } from '@/user/schemas';
import { Product } from '@/product/schemas';

@Injectable()
export class EmailEventHandlers {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(UserRegisterEvent.event, { async: true })
  async handleUserRegisterEvent(event: UserRegisterEvent) {
    await this.emailService.sendMail(EmailType.WELCOME, {
      to: event.user.email,
      subject: 'Welcome to our platform',
      context: {
        name: event.user.name,
      },
    });
  }

  @OnEvent(UserResetPasswordRequestEvent.event)
  async handleUserResetPasswordRequestEvent(
    event: UserResetPasswordRequestEvent,
  ) {
    await this.emailService.sendMail(EmailType.PASSWORD_RESET_REQUEST, {
      to: event.user.email,
      subject: 'Reset your password',
      context: {
        name: event.user.name,
        resetLink: event.resetLink,
      },
    });
  }

  @OnEvent(UserResetPasswordEvent.event, { async: true })
  async handleUserResetPasswordEvent(event: UserResetPasswordEvent) {
    await this.emailService.sendMail(EmailType.PASSWORD_RESET_SUCCESS, {
      to: event.user.email,
      subject: 'Password reset successful',
      context: {
        name: event.user.name,
      },
    });
  }

  @OnEvent(OrderCreatedEvent.event, { async: true })
  async handleOrderCreatedEvent(event: OrderCreatedEvent) {
    const { order } = event;

    await order.populate([
      { path: 'user', select: 'name email' },
      { path: 'products.product', select: 'name price image' },
    ]);

    const user = order.user as User;
    const total = order.total;
    const products = order.products.map((orderProduct) => {
      const product = orderProduct.product as Product;

      return {
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: orderProduct.quantity,
      };
    });

    await this.emailService.sendMail(EmailType.ORDER_CONFIRMATION, {
      to: user.email,
      subject: 'Order confirmation',
      context: {
        name: user.name,
        orderId: event.order._id,
        total,
        products,
      },
    });
  }
}
