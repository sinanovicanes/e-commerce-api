import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDefinition } from './schemas';

@Module({
  imports: [MongooseModule.forFeature([OrderDefinition])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
