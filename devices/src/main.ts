import { NestFactory } from '@nestjs/core';
import { Transport, RmqOptions } from '@nestjs/microservices';

import { DevicesModule } from './devices.module';
import { ConfigService } from './services/config/config.service';

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.createMicroservice(DevicesModule, {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('rabbitmqUrl')],
      queue: configService.get('deviceQueue'),
      queueOptions: {
        durable: false,
      },
    },
  } as RmqOptions);
  await app.listen();
}
bootstrap();
