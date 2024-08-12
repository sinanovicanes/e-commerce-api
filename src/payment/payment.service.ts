import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schemas';
import { Model } from 'mongoose';
import { Order } from '@/order/schemas';
import { Request } from 'express';
import { User } from '@/user/schemas';
import { CardInfoDto } from './dtos/card-info.dto';
import { CreateOrderDto } from '@/order/dtos';
import { PaymentGateways } from './enums';
import { IyzipayPaymentGateway } from './gateways';

@Injectable()
export class PaymentService {
  @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>;
  @Inject() private readonly iyzipayPaymentGateway: IyzipayPaymentGateway;

  async createPayment(
    req: Request,
    user: User,
    order: Order,
    orderDto: CreateOrderDto,
  ): Promise<Payment> {
    const results = await this.iyzipayPaymentGateway
      .createPaymentIntent(req, user, order, orderDto)
      .catch((error) => {
        throw new HttpException(error, 500);
      });

    const payment = new this.paymentModel({
      gateway: PaymentGateways.IYZIPAY,
      order: order._id,
      user: user._id,
      paymentId: results.paymentId,
    });

    await payment.save();

    return payment;
  }
}
