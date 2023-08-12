import { registerAs } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigKey } from '../config.enum';
import { IRedisConfig } from '../config.interface';

export const redisStoreConfig = registerAs(
  ConfigKey.STORE,
  (): IRedisConfig => ({
    store: redisStore,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: Number(process.env.REDIS_PORT),
    db: process.env.REDIS_DB || '0',
    ttl: Number(process.env.REDIS_TTL) || 1000,
  })
);

export const redisCacheConfig = registerAs(
  ConfigKey.CACHE,
  (): IRedisConfig => ({
    store: redisStore,
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB || '0',
    ttl: Number(process.env.REDIS_TTL) || 1000,
  })
);
