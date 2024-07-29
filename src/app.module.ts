import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: 'ecommerce',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
