declare module 'rate-limiter-flexible' {
  import { RedisClientType } from "redis";

  interface RateLimiterOptions {
    storeClient: RedisClientType;
    keyPrefix?: string;
    points: number;
    duration: number;
    blockDuration?: number;
  }

  interface RateLimiterRes {
    consumedPoints: number;
    msBeforeNext: number;
    isBlocked: boolean;
  }

  export class RateLimiterRedis {
    constructor(options: RateLimiterOptions);
    get(key: string): Promise<RateLimiterRes | null>;
    consume(key: string, points: number): Promise<RateLimiterRes>;
  }

}