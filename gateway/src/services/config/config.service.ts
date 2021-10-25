import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {};
    this.envConfig.port = process.env.API_PORT;
    this.envConfig.authService = {
      options: {
        port: process.env.API_PORT,
        host: process.env.AUTHENTICATION_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
    this.envConfig.userService = {
      options: {
        port: process.env.API_PORT,
        host: process.env.USER_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
    this.envConfig.taskService = {
      options: {
        port: process.env.API_PORT,
        host: process.env.TASK_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
    this.envConfig.permissionService = {
      options: {
        port: process.env.API_PORT,
        host: process.env.PERMISSION_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
    this.envConfig.devicesService = {
      options: {
        port: process.env.API_PORT,
        host: process.env.DEVICES_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
