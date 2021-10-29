import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      rabbitmqUrl: process.env.RABBITMQ_URL,
      authQueue: process.env.RABBITMQ_AUTH_QUEUE,
    };
    this.envConfig.devicesService = {
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.RABBITMQ_DEVICES_QUEUE,
        queueOptions: {
          durable: false,
        },
      },
      transport: Transport.RMQ,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
