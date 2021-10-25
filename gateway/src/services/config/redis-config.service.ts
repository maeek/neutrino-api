import {
  BullModuleOptions,
  BullOptionsFactory,
} from '@nestjs/bull';

export class RedisConfigService implements BullOptionsFactory {
  createBullOptions(): BullModuleOptions {
    return {
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    };
  }
}
