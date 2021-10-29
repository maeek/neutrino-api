import { NestFactory } from '@nestjs/core';
import { Transport, TcpOptions, RmqOptions } from '@nestjs/microservices';

import { PermissionModule } from './permission.module';
import { ConfigService } from './services/config/config.service';

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.createMicroservice(PermissionModule, {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('rabbitmqUrl')],
      queue: configService.get('permissionQueue'),
      queueOptions: {
        durable: false,
      },
    },
  } as RmqOptions);
  await app.listen();
}
bootstrap();
