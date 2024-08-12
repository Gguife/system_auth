import { createClient } from 'redis';
import { config } from 'dotenv';

config();

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-15554.c262.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 15554,
    }
});

client.on('error', (err) => {
  console.error('Redis Client Error', err);
})

export default client;