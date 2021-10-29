import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  Response,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { Request, Response as EResponse } from 'express';
import { AUTHENTICATION_MESSAGE_PATTERNS } from './constants';

@Controller('auth')
@ApiTags('auth')
export class AuthenticationController {
  constructor(
    @Inject('AUTHENTICATION_SERVICE')
    private readonly authenticationServiceClient: ClientProxy,
  ) {}

  @Post('login')
  public async login(
    @Req() request: Request,
    @Body() dto: any,
    @Response() response: EResponse,
  ): Promise<any> {
    const meta = request.headers['user-agent'];

    const loginResponse = await firstValueFrom(
      this.authenticationServiceClient.send(
        AUTHENTICATION_MESSAGE_PATTERNS.LOGIN,
        {
          username: dto.username,
          password: dto.password,
          device: {
            meta,
            name: dto.deviceName,
          },
        },
      ),
    );

    if (loginResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: loginResponse.message,
          error: loginResponse.errors,
        },
        loginResponse.status,
      );
    }

    response.setHeader(
      'x-ne-refreshtoken',
      loginResponse.resources.refreshToken,
    );
    response
      .json({
        resources: {
          device: {
            device_id: loginResponse.resources.device.device_id,
          },
          user: loginResponse.resources.user,
          accessToken: loginResponse.resources.accessToken,
        },
      })
      .end();
  }

  @Delete('/logout')
  public async logout(@Req() request: Request, @Body() dto: any): Promise<any> {
    const { deviceId, userId } = dto;
    const refreshToken = request.headers['x-ne-refreshtoken'];

    const logoutResult = await firstValueFrom(
      this.authenticationServiceClient.send(
        AUTHENTICATION_MESSAGE_PATTERNS.LOGOUT,
        {
          device_id: deviceId,
          refresh_token: refreshToken,
          user_id: userId,
        },
      ),
    );

    if (logoutResult.status !== HttpStatus.NO_CONTENT)
      throw new HttpException(
        {
          message: logoutResult.message,
          error: logoutResult.errors,
        },
        logoutResult.status,
      );

    return {};
  }
  // @Get('/:device_id')
  // @ApiOkResponse({
  //   type: GetUserByTokenResponseDto,
  // })
  // public async getDevice(@Param('device_id') device_id: string): Promise<any> {
  //   const devicesResponse: any = await firstValueFrom(
  //     this.authenticationServiceClient.send(DEVICE_MESSAGE_PATTERNS.DEVICE_GET, {
  //       device_id,
  //     }),
  //   );

  //   return {
  //     resources: {
  //       device: devicesResponse.resources,
  //     },
  //     error: devicesResponse?.error,
  //   };
  // }

  // @Delete('/:device_id')
  // @ApiOkResponse({
  //   type: GetUserByTokenResponseDto,
  // })
  // public async removeDevice(
  //   @Param('device_id') device_id: string,
  // ): Promise<any> {
  //   const devicesResponse: any = await firstValueFrom(
  //     this.authenticationServiceClient.send(DEVICE_MESSAGE_PATTERNS.DEVICE_REMOVE, {
  //       device_id,
  //     }),
  //   );

  //   return {
  //     error: devicesResponse?.error,
  //   };
  // }
}
