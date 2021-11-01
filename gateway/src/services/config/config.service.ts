import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {};
    this.envConfig.port = process.env.API_PORT;
    this.envConfig.authService = {
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.RABBITMQ_AUTH_QUEUE,
        queueOptions: {
          durable: false,
        },
      },
      transport: Transport.RMQ,
    };
    this.envConfig.usersService = {
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.RABBITMQ_USER_QUEUE,
        queueOptions: {
          durable: false,
        },
      },
      transport: Transport.RMQ,
    };
    this.envConfig.permissionService = {
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.RABBITMQ_PERMISSION_QUEUE,
        queueOptions: {
          durable: false,
        },
      },
      transport: Transport.RMQ,
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
