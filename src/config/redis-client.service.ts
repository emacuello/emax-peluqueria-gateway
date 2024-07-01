import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { HOST_REDIS, PASSWORD_REDIS, PORT_REDIS } from './env';

@Injectable()
export class RedisClientService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: HOST_REDIS,
      port: Number(PORT_REDIS),
      password: PASSWORD_REDIS,
    });
  }

  getClient(): Redis {
    return this.client;
  }
}
