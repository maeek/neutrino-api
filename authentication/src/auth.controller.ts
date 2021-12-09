import { Controller, HttpStatus, Inject, Logger } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { AuthService } from './services/auth.service';
import { DEVICE_MESSAGE_PATTERNS, MESSAGE_PATTERNS } from './constants';
import { LoginDto } from './interfaces/dto/login.dto';
import { LoginResponse } from './interfaces/login-response.interface';
import { firstValueFrom } from 'rxjs';
import { Schema } from 'mongoose';
import { IDeviceResponse } from './interfaces/devices/device-register-response.interface';
import { LogoutDto } from './interfaces/dto/logout.dto';
import { LogoutResponse } from './interfaces/logout-response.interface';

@Controller('Auth')
export class AuthController {
  private readonly logger = new Logger();

  constructor(
    @Inject('DEVICES_SERVICE')
    private readonly devicesServiceClient: ClientProxy,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern(MESSAGE_PATTERNS.LOGIN)
  public async login({
    username,
    password,
    device,
  }: LoginDto): Promise<LoginResponse> {
    try {
      if (!username || !password || !device?.meta || !device?.name)
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'login_bad_request',
          errors: {
            login_bad_request:
              'Body is missing "username", "password" or "device" property',
          },
        };

      const { status, message, errors, resources } = await firstValueFrom(
        this.devicesServiceClient.send<IDeviceResponse>(
          DEVICE_MESSAGE_PATTERNS.DEVICE_REGISTER,
          {
            name: device.name,
            meta: device.meta,
          },
        ),
      );

      if (status !== HttpStatus.CREATED) return { status, message, errors };

      const loginResponse = await this.authService.login({
        username,
        password,
        device,
        ref_id: resources.device.ref_id as unknown as Schema.Types.ObjectId,
      });

      if (!loginResponse?.user)
        return {
          status: HttpStatus.UNAUTHORIZED,
          message: 'login_unauthorized',
          errors: {
            login_unauthorized: 'Invalid credentials',
          },
        };

      return {
        status: HttpStatus.CREATED,
        message: 'login_created',
        resources: {
          device: {
            deviceId: resources.device.deviceId,
          },
          user: loginResponse.user,
          accessToken: loginResponse.accessToken,
          refreshToken: loginResponse.refreshToken,
        },
      };
    } catch (e) {
      this.logger.error(e);
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'login_unauthorized',
        errors: {
          login_unauthorized: 'Invalid credentials',
        },
      };
    }
  }

  @MessagePattern(MESSAGE_PATTERNS.LOGOUT)
  public async logout({
    deviceId,
    refreshToken,
    username,
  }: LogoutDto): Promise<LogoutResponse> {
    try {
      if (![deviceId, refreshToken, username].some((u) => !!u))
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'logout_bad_request',
          errors: {
            logout_bad_request: 'Invalid request',
          },
        };

      const deleted = await this.authService.deleteTokens(
        refreshToken,
        deviceId,
        username,
      );

      if (!deleted)
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'logout_bad_request',
          errors: {
            logout_bad_request: 'Invalid request',
          },
        };

      return {
        status: HttpStatus.NO_CONTENT,
        message: 'logout_success',
      };
    } catch (e) {
      this.logger.error(e);
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'logout_bad_request',
        errors: {
          logout_bad_request: 'Invalid credentials',
        },
      };
    }
  }

  // @MessagePattern(MESSAGE_PATTERNS.KEEPALIVE)
  // public async keepalive(data: { refreshToken: string }) {}

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
