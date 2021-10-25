import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ClientProxyFactory } from '@nestjs/microservices';

import { UsersController } from './users.controller';

import { AuthGuard } from './services/guards/authorization.guard';
import { PermissionGuard } from './services/guards/permission.guard';

import { ConfigService } from './services/config/config.service';
import { DevicesController } from './devices.controller';

@Module({
  imports: [],
  controllers: [
    DevicesController
  ],
  providers: [
    ConfigService,
    {
      provide: 'AUTH_SERVICE',
      useFactory: (configService: ConfigService) => {
        const tokenServiceOptions = configService.get('authService');
        return ClientProxyFactory.create(tokenServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'DEVICES_SERVICE',
      useFactory: (configService: ConfigService) => {
        const devicesServiceOptions = configService.get('devicesService');
        return ClientProxyFactory.create(devicesServiceOptions);
      },
      inject: [ConfigService],
    },
    // {
    //   provide: 'USER_SERVICE',
    //   useFactory: (configService: ConfigService) => {
    //     const userServiceOptions = configService.get('userService');
    //     return ClientProxyFactory.create(userServiceOptions);
    //   },
    //   inject: [ConfigService],
    // },
    // {
    //   provide: 'PERMISSION_SERVICE',
    //   useFactory: (configService: ConfigService) => {
    //     return ClientProxyFactory.create(
    //       configService.get('permissionService'),
    //     );
    //   },
    //   inject: [ConfigService],
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: PermissionGuard,
    // },
  ],
})
export class AppModule {}
