import { Module } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { MerchantController } from './merchant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MerchantDefinition } from './schemas';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [MongooseModule.forFeature([MerchantDefinition]), UserModule],
  controllers: [MerchantController],
  providers: [MerchantService],
})
export class MerchantModule {}
