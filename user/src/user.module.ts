import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { MongoConfigService } from './services/config/mongo-config.service';
import { ConfigService } from './services/config/config.service';
import { UserSchema } from './schemas/old-user.schema';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
        collection: 'users',
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, ConfigService, UserRepository],
})
export class UserModule {}
