import { createClient, RedisClientType } from 'redis';
import { config } from 'dotenv';

config();

const redisClient: RedisClientType = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-15554.c262.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 15554,
    }
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
})

export default redisClient;