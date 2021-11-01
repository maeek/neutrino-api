import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Response } from 'express';
import { AppModule } from './app.module';
import { ConfigService } from './services/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Neutrino - API docs')
    .addTag('auth')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  app.use((_req, res: Response, next) => {
    res.removeHeader('X-Powered-By');
    next();
  });
  app.use(helmet());

  await app.listen(new ConfigService().get('port'));
}
bootstrap();
