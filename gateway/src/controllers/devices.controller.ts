import {
  Controller,
  Post,
  Get,
  Req,
  Inject,
  Param,
  Delete,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DEVICE_MESSAGE_PATTERNS } from '../constants';

@Controller('devices')
@ApiTags('devices')
export class DevicesController {
  constructor(
    @Inject('DEVICES_SERVICE')
    private readonly devicesServiceClient: ClientProxy,
  ) {}

  @Post()
  public async registerDevice(@Req() request: Request): Promise<any> {
    const meta = request.headers['user-agent'];
    const name = 'test name';

    const devicesResponse: any = await firstValueFrom(
      this.devicesServiceClient.send(DEVICE_MESSAGE_PATTERNS.DEVICE_REGISTER, {
        name,
        meta,
      }),
    );

    if (devicesResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: devicesResponse.message,
          data: null,
          error: devicesResponse.errors,
        },
        devicesResponse.status,
      );
    }

    return {
      resources: {
        device: devicesResponse.resources.device,
      },
      error: devicesResponse?.error,
    };
  }

  @Get('/:deviceId')
  public async getDevice(@Param('deviceId') deviceId: string): Promise<any> {
    const devicesResponse: any = await firstValueFrom(
      this.devicesServiceClient.send(DEVICE_MESSAGE_PATTERNS.DEVICE_GET, {
        deviceId,
      }),
    );

    return {
      resources: {
        device: devicesResponse.resources,
      },
      error: devicesResponse?.error,
    };
  }

  @Delete('/:deviceId')
  public async removeDevice(@Param('deviceId') deviceId: string): Promise<any> {
    const devicesResponse: any = await firstValueFrom(
      this.devicesServiceClient.send(DEVICE_MESSAGE_PATTERNS.DEVICE_REMOVE, {
        deviceId,
      }),
    );

    return {
      error: devicesResponse?.error,
    };
  }
}
