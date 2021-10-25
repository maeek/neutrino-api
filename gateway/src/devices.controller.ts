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
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { GetUserByTokenResponseDto } from './interfaces/user/dto/get-user-by-token-response.dto';
import { DEVICE_MESSAGE_PATTERNS } from './constants';

@Controller('devices')
@ApiTags('devices')
export class DevicesController {
  constructor(
    @Inject('DEVICES_SERVICE')
    private readonly devicesServiceClient: ClientProxy,
  ) {}

  @Post()
  @ApiOkResponse({
    type: GetUserByTokenResponseDto,
  })
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
          errors: devicesResponse.errors,
        },
        devicesResponse.status,
      );
    }

    return {
      resources: {
        device: devicesResponse.resources.device,
      },
      errors: devicesResponse?.error,
    };
  }

  @Get('/:device_id')
  @ApiOkResponse({
    type: GetUserByTokenResponseDto,
  })
  public async getDevice(@Param('device_id') device_id: string): Promise<any> {
    const devicesResponse: any = await firstValueFrom(
      this.devicesServiceClient.send(DEVICE_MESSAGE_PATTERNS.DEVICE_GET, {
        device_id,
      }),
    );

    return {
      resources: {
        device: devicesResponse.resources,
      },
      errors: devicesResponse?.error,
    };
  }

  @Delete('/:device_id')
  @ApiOkResponse({
    type: GetUserByTokenResponseDto,
  })
  public async removeDevice(
    @Param('device_id') device_id: string,
  ): Promise<any> {
    const devicesResponse: any = await firstValueFrom(
      this.devicesServiceClient.send(DEVICE_MESSAGE_PATTERNS.DEVICE_REMOVE, {
        device_id,
      }),
    );

    return {
      errors: devicesResponse?.error,
    };
  }
}
