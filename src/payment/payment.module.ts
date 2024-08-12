import { Global, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentDefinition } from './schemas';
import { IyzipayPaymentGateway } from './gateways';

@Global()
@Module({
  imports: [MongooseModule.forFeature([PaymentDefinition])],
  controllers: [],
  providers: [PaymentService, IyzipayPaymentGateway],
  exports: [PaymentService],
})
export class PaymentModule {}
