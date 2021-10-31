import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, RmqOptions } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { ConfigService } from './services/config/config.service';

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.createMicroservice(AuthModule, {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('rabbitmqUrl')],
      queue: configService.get('authQueue'),
      queueOptions: {
        durable: false,
      },
    },
  } as RmqOptions);

  app.useLogger(Logger);
  await app.listen();
}
bootstrap();
