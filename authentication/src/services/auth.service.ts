import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { Schema } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { LoginResponseResources } from '../interfaces/login-response.interface';
import { DEVICE_MESSAGE_PATTERNS } from '../constants';
import { LoginDto } from '../interfaces/dto/login.dto';
import { TokenRepository } from '../token.repository';

const getTestUser = (username: string) =>
  Promise.resolve({
    username: username,
    password: 'test',
    type: 'user',
  });

@Injectable()
export class AuthService {
  constructor(
    @Inject('DEVICES_SERVICE')
    private readonly devicesServiceClient: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  public async validateUserLocal(
    username: string,
    password: string,
  ): Promise<any> {
    const foundUser = await getTestUser(username);

    if (!foundUser) return null;
    if (foundUser.password !== password) return null;

    return {
      ...foundUser,
      password: undefined,
    };
  }

  public async login({
    username,
    password,
    // loginStrategy = 1,
    ref_id,
  }: LoginDto & {
    ref_id: Schema.Types.ObjectId;
  }) {
    const user = await this.validateUserLocal(username, password);

    if (!user) return {};

    return {
      user: {
        username,
        type: user.type,
      },
      accessToken: await this.createAccessToken(username, user.type),
      refreshToken: await this.createRefreshToken(username, ref_id),
    };
  }

  public async createAccessToken(username: string, role: string) {
    return this.jwtService.signAsync(
      {
        sub: username,
        role,
      },
      {
        expiresIn: '20m',
      },
    );
  }

  public async createRefreshToken(
    username: string,
    deviceId: Schema.Types.ObjectId,
  ) {
    const refreshToken = await this.jwtService.signAsync(
      {},
      {
        expiresIn: '1y',
      },
    );

    await this.tokenRepository.create({
      username,
      device: deviceId,
      refreshToken: refreshToken,
    });

    return refreshToken;
  }

  public deleteTokensForUserId(username: string) {
    return this.tokenRepository.remove({
      username,
    });
  }

  private async searchForDeviceId(deviceId: string) {
    return await firstValueFrom(
      this.devicesServiceClient.send(DEVICE_MESSAGE_PATTERNS.DEVICE_GET, {
        deviceId,
      }),
    );
  }

  public async deleteTokensForDeviceId(deviceId: string) {
    const deviceResponse = await this.searchForDeviceId(deviceId);

    if (deviceResponse.status !== HttpStatus.OK) return false;

    const deleteTokenResponse = await this.tokenRepository.remove({
      device: deviceResponse.resources.device.id,
    });
    const deleteDeviceResponse = await firstValueFrom(
      this.devicesServiceClient.send(DEVICE_MESSAGE_PATTERNS.DEVICE_REMOVE, {
        deviceId,
      }),
    );

    return (
      deleteTokenResponse.deletedCount &&
      deleteDeviceResponse.status === HttpStatus.OK
    );
  }

  public async deleteTokensForRefreshToken(refreshToken: string) {
    const tokenResults = await this.tokenRepository.findOne({ refreshToken });

    if (!tokenResults?.device) return false;

    const deviceResponse = await firstValueFrom(
      this.devicesServiceClient.send(
        DEVICE_MESSAGE_PATTERNS.DEVICE_GET_OBJECTID,
        {
          device: tokenResults.device.toString(),
        },
      ),
    );

    if (deviceResponse.status !== HttpStatus.OK) return false;

    const deleteTokenResponse = await this.tokenRepository.remove({
      device: deviceResponse.resources.device.id,
    });
    const deleteDeviceResponse = await firstValueFrom(
      this.devicesServiceClient.send(DEVICE_MESSAGE_PATTERNS.DEVICE_REMOVE, {
        deviceId: deviceResponse.resources.device.deviceId,
      }),
    );

    return (
      deleteTokenResponse.deletedCount &&
      deleteDeviceResponse.status === HttpStatus.OK
    );
  }

  public async deleteTokens(
    refreshToken: string,
    deviceId?: string,
    username?: string,
  ) {
    if (deviceId) return this.deleteTokensForDeviceId(deviceId);
    if (username) return this.deleteTokensForUserId(username);

    return this.deleteTokensForRefreshToken(refreshToken);
  }
}
