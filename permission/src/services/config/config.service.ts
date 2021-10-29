export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      rabbitmqUrl: process.env.RABBITMQ_URL,
      permissionQueue: process.env.RABBITMQ_PERMISSION_QUEUE,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
