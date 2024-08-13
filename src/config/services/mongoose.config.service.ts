import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { Environment } from '../env.validation';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  @Inject() private readonly configService: ConfigService;

  private getDbName(): string {
    switch (this.configService.get<string>('NODE_ENV')) {
      case Environment.TEST:
        return 'ecommerce-test';
      default:
        return 'ecommerce';
    }
  }

  createMongooseOptions(): MongooseModuleOptions {
    const dbName = this.getDbName();

    return {
      uri: this.configService.get<string>('MONGO_URI'),
      dbName,
    };
  }
}
