import { seconds } from '@/utils/date';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  @Inject() private readonly configService: ConfigService;

  async createCacheOptions(): Promise<CacheModuleOptions> {
    return {
      isGlobal: true,
      store: await redisStore({
        ttl: seconds(15, true),
        socket: {
          host: this.configService.get<string>('REDIS_HOST'),
          port: this.configService.get<number>('REDIS_PORT'),
        },
      }),
    };
  }
}
