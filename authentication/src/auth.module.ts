import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthenticationService } from './services/auth.service';
import { JwtConfigService } from './services/config/jwt-config.service';
import { MongoConfigService } from './services/config/mongo-config.service';
import { Token, TokenSchema } from './schemas/token.schema';

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
  ],
  controllers: [AuthController],
  providers: [AuthenticationService],
})
export class TokenModule {}
