import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { Request, Response as EResponse } from 'express';
import { AUTHENTICATION_MESSAGE_PATTERNS } from '../constants';
import { API_HEADERS } from '../interfaces/authentication/headers.enum';

import {
  LoginErrorResponse,
  LoginResponse,
} from '../interfaces/authentication/login-response.dto';
import {
  LoginDto,
  LoginResponseDto,
} from '../interfaces/authentication/dto/login.dto';
import {
  LogoutDto,
  LogoutResponseDto,
} from '../interfaces/authentication/dto/logout.dto';
import {
  LogoutErrorResponse,
  LogoutResponse,
} from '../interfaces/authentication/logout-response.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthenticationController {
  constructor(
    @Inject('AUTHENTICATION_SERVICE')
    private readonly authenticationServiceClient: ClientProxy,
  ) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponse })
  @ApiUnauthorizedResponse({ type: LoginErrorResponse })
  @ApiBadRequestResponse({ type: LoginErrorResponse })
  public async login(
    @Req() request: Request,
    @Body() dto: LoginDto,
    @Response() response: EResponse<LoginResponse>,
  ): Promise<void> {
    const { newDeviceName, password, username, loginStrategy } = dto;
    const meta = request.headers['user-agent'];

    const { status, message, errors, resources } = await firstValueFrom(
      this.authenticationServiceClient.send<LoginResponseDto>(
        AUTHENTICATION_MESSAGE_PATTERNS.LOGIN,
        {
          username,
          password,
          loginStrategy,
          device: {
            meta,
            name: newDeviceName,
          },
        },
      ),
    );

    if (status !== HttpStatus.CREATED) {
      throw new UnauthorizedException({
        message: message,
        errors: errors,
      });
    }

    response.setHeader(API_HEADERS.X_NE_REFRESHTOKEN, resources.refreshToken);
    response
      .status(status || HttpStatus.CREATED)
      .json({
        resources: {
          device: resources.device,
          user: resources.user,
          accessToken: resources.accessToken,
        },
      })
      .end();
  }

  @Delete('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({ type: LogoutDto })
  @ApiHeader({
    name: 'Authorization',
    required: true,
  })
  @ApiOkResponse({ type: LogoutResponse })
  @ApiUnauthorizedResponse({ type: LogoutErrorResponse })
  @ApiBadRequestResponse({ type: LogoutErrorResponse })
  public async logout(
    @Req() request: Request,
    @Body() dto: LogoutDto,
  ): Promise<LogoutResponse> {
    const { deviceId, username } = dto;
    const refreshToken = request.headers[API_HEADERS.AUTHORIZATION];

    const { status, message, errors } = await firstValueFrom(
      this.authenticationServiceClient.send<LogoutResponseDto>(
        AUTHENTICATION_MESSAGE_PATTERNS.LOGOUT,
        {
          deviceId,
          refreshToken: refreshToken?.split(' ')?.[1] || '',
          username,
        },
      ),
    );

    if (status !== HttpStatus.NO_CONTENT)
      throw new HttpException(
        {
          message: message,
          error: errors,
        },
        status,
      );

    return {};
  }
}
