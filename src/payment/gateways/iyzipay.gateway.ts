import { Order } from '@/order/schemas';
import { PaymentGateway } from './payment.gateway';
import * as Iyzipay from 'iyzipay';
import { User } from '@/user/schemas';
import { Request } from 'express';
import { CreateOrderDto } from '@/order/dtos';
import { Payment } from '../schemas';
import { Product } from '@/product/schemas';

export class IyzipayPaymentGateway implements PaymentGateway {
  private readonly client: Iyzipay;

  constructor() {
    this.client = new Iyzipay({
      apiKey: process.env.IYZIPAY_API_KEY,
      secretKey: process.env.IYZIPAY_SECRET_KEY,
      uri:
        process.env.NODE_ENV === 'production'
          ? 'https://api.iyzipay.com'
          : 'https://sandbox-api.iyzipay.com',
    });
  }

  private getShippingAddress(
    orderDto: CreateOrderDto,
  ): Iyzipay.PaymentRequestData['shippingAddress'] {
    return {
      contactName: orderDto.shipmentAddress.contactName,
      city: orderDto.shipmentAddress.city,
      country: orderDto.shipmentAddress.country,
      address: orderDto.shipmentAddress.address,
      zipCode: orderDto.shipmentAddress.zipCode,
    };
  }

  private getBillingAddress(
    orderDto: CreateOrderDto,
  ): Iyzipay.PaymentRequestData['billingAddress'] {
    return {
      contactName: orderDto.billingAddress.contactName,
      city: orderDto.billingAddress.city,
      country: orderDto.billingAddress.country,
      address: orderDto.billingAddress.address,
      zipCode: orderDto.billingAddress.zipCode,
    };
  }

  private getPaymentCard(
    orderDto: CreateOrderDto,
  ): Iyzipay.PaymentRequestData['paymentCard'] {
    return {
      cardHolderName: orderDto.paymentCard.cardHolderName,
      cardNumber: orderDto.paymentCard.cardNumber,
      expireMonth: orderDto.paymentCard.expireMonth,
      expireYear: orderDto.paymentCard.expireYear,
      cvc: orderDto.paymentCard.cvc,
      cardAlias: orderDto.paymentCard.cardAlias,
      registerCard: orderDto.paymentCard.registerCard ? 1 : 0,
    };
  }

  private getBuyer(
    req: Request,
    user: User,
    orderDto: CreateOrderDto,
  ): Iyzipay.PaymentRequestData['buyer'] {
    return {
      id: user._id.toString(),
      name: user.name,
      surname: user.lastname,
      // gsmNumber: '+905350000000',
      email: user.email,
      identityNumber: orderDto.identityNumber,
      // lastLoginDate: '2015-10-05 12:43:35',
      // registrationDate: '2013-04-21 15:12:09',
      registrationAddress: orderDto.billingAddress.address,
      ip: req.ip,
      city: orderDto.shipmentAddress.city,
      country: orderDto.shipmentAddress.country,
      zipCode: orderDto.shipmentAddress.zipCode,
    };
  }

  private async getBasketItems(
    order: Order,
  ): Promise<Iyzipay.PaymentRequestData['basketItems']> {
    await order.populate('products.product');

    return order.products.map((orderProduct) => {
      const product = orderProduct.product as Product;

      return {
        id: product._id.toString(),
        name: product.name,
        category1: product.category,
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: product.price * orderProduct.quantity,
      };
    });
  }

  private async createPaymentRequestData(
    req: Request,
    user: User,
    order: Order,
    orderDto: CreateOrderDto,
  ): Promise<Iyzipay.PaymentRequestData> {
    const total = order.total;
    const buyer = this.getBuyer(req, user, orderDto);
    const paymentCard = this.getPaymentCard(orderDto);
    const shippingAddress = this.getShippingAddress(orderDto);
    const billingAddress = this.getBillingAddress(orderDto);
    const basketItems = await this.getBasketItems(order);
    const paymentRequestData: Iyzipay.PaymentRequestData = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: order._id.toString(),
      price: total,
      paidPrice: total,
      currency: Iyzipay.CURRENCY.TRY,
      installments: 1,
      basketId: order._id.toString(),
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      paymentCard,
      buyer,
      shippingAddress,
      billingAddress,
      basketItems,
    };

    return paymentRequestData;
  }

  createPaymentIntent(
    req: Request,
    user: User,
    order: Order,
    orderDto: CreateOrderDto,
  ): Promise<Iyzipay.PaymentResult> {
    return new Promise(async (resolve, reject) => {
      const paymentRequestData = await this.createPaymentRequestData(
        req,
        user,
        order,
        orderDto,
      );

      this.client.payment.create(paymentRequestData, (err, result) => {
        if (err) {
          reject(err);
        } else {
          switch (result.status) {
            case 'success':
              resolve(result);
              break;
            case 'failure':
              reject(result);
              break;
            default:
              reject(result);
              break;
          }
        }
      });
    });
  }

  // This method will be used to process the payment
  async processPayment(order: Order) {
    // The implementation of the payment processing will go here
  }
}
