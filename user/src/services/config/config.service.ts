import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      rabbitmqUrl: process.env.RABBITMQ_URL,
      userQueue: process.env.RABBITMQ_USER_QUEUE,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
