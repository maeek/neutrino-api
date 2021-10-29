import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { Transport, RmqOptions } from '@nestjs/microservices';

import { ConfigService } from './services/config/config.service';

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.createMicroservice(UserModule, {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('rabbitmqUrl')],
      queue: configService.get('userQueue'),
      queueOptions: {
        durable: false,
      },
    },
  } as RmqOptions);
  await app.listen();
}
bootstrap();
