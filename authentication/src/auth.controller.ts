import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { AuthService } from './services/auth.service';
import { DEVICE_MESSAGE_PATTERNS, MESSAGE_PATTERNS } from './constants';
import { LoginDto } from './interfaces/dto/login-dto';
import { LoginResponse } from './interfaces/login-response';
import { firstValueFrom } from 'rxjs';
import { Schema } from 'mongoose';

@Controller('Auth')
export class AuthController {
  constructor(
    @Inject('DEVICES_SERVICE')
    private readonly devicesServiceClient: ClientProxy,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern(MESSAGE_PATTERNS.LOGIN)
  public async login(data: LoginDto): Promise<LoginResponse> {
    if (
      !data?.username ||
      !data?.password ||
      !data?.device?.meta ||
      !data?.device?.name
    )
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'login_bad_request',
        error: 'Body is missing "username", "password" or "device" property',
      };

    const registeredDevice = await firstValueFrom(
      this.devicesServiceClient.send(DEVICE_MESSAGE_PATTERNS.DEVICE_REGISTER, {
        name: data.device.name,
        meta: data.device.meta,
      }),
    );

    if (registeredDevice.status !== HttpStatus.CREATED)
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: registeredDevice.message,
        error: registeredDevice.errors,
      };

    const loginResponse = await this.authService.login({
      ...data,
      ref_id: registeredDevice.resources.device.ref_id as Schema.Types.ObjectId,
    });

    if (!loginResponse?.ok)
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'login_unauthorized',
        error: 'Username or password is incorrect',
      };

    return {
      status: HttpStatus.OK,
      message: 'login_ok',
      resources: {
        device: {
          device_id: registeredDevice.resources.device.device_id,
        },
        user: loginResponse.user,
        accessToken: loginResponse.accessToken,
        refreshToken: loginResponse.refreshToken,
      },
    };
  }

  @MessagePattern(MESSAGE_PATTERNS.LOGOUT)
  public async logout(data: {
    device_id: string;
    refresh_token: string;
    user_id: string;
  }) {
    const deleted = await this.authService.deleteTokens(
      data.refresh_token,
      data.device_id,
      data.user_id,
    );

    if (!deleted)
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'logout_bad_request',
        error: 'Invalid request',
      };

    return {
      status: HttpStatus.NO_CONTENT,
      message: 'logout_success',
    };
  }

  @MessagePattern(MESSAGE_PATTERNS.KEEPALIVE)
  public async keepalive(data: { refresh_token: string }) {}

  // @MessagePattern('token_decode')
  // public async decodeToken(data: {
  //   token: string;
  // }): Promise<ITokenDataResponse> {
  //   const tokenData = await this.authService.decodeToken(data.token);
  //   return {
  //     status: tokenData ? HttpStatus.OK : HttpStatus.UNAUTHORIZED,
  //     message: tokenData ? 'token_decode_success' : 'token_decode_unauthorized',
  //     data: tokenData,
  //   };
  // }
}
