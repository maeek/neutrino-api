import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientProxyFactory } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtConfigService } from './services/config/jwt-config.service';
import { MongoConfigService } from './services/config/mongo-config.service';
import { Token, TokenSchema } from './schemas/token.schema';
import { TokenRepository } from './token.repository';
import { ConfigService } from './services/config/config.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    MongooseModule.forFeature([
      {
        name: Token.name,
        schema: TokenSchema,
      },
    ]),
    PassportModule
  ],
  controllers: [AuthController],
  providers: [
    ConfigService,
    AuthService,
    TokenRepository,
    LocalStrategy,
    {
      provide: 'DEVICES_SERVICE',
      useFactory: (configService: ConfigService) => {
        const devicesServiceOptions = configService.get('devicesService');
        return ClientProxyFactory.create(devicesServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class AuthModule {}
