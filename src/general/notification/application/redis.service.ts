import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
  private pubClient = createClient({ url: 'redis://localhost:6379' });
  private subClient = createClient({ url: 'redis://localhost:6379' });

  constructor() {
    this.pubClient.connect();
    this.subClient.connect();
  }

  async publish(channel: string, message: string) {
    await this.pubClient.publish(channel, message);
  }

  async subscribe(channel: string, callback: (msg: string) => void) {
    this.subscribe(channel, (message) => callback(message));
  }
}
