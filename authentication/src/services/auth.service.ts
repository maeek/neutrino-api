import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { Schema } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { DEVICE_MESSAGE_PATTERNS } from '../constants';
import { LoginDto } from '../interfaces/dto/login-dto';
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
  }: LoginDto & { ref_id: Schema.Types.ObjectId }): Promise<any> {
    const user = await this.validateUserLocal(username, password);

    if (!user) return;

    return {
      ok: true,
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
    device_id: Schema.Types.ObjectId,
  ) {
    const refreshToken = await this.jwtService.signAsync(
      {},
      {
        expiresIn: '1y',
      },
    );

    await this.tokenRepository.create({
      user_id: username,
      device: device_id,
      refresh_token: refreshToken,
    });

    return refreshToken;
  }

  public deleteTokensForUserId(userId: string) {
    return this.tokenRepository.remove({
      user_id: userId,
    });
  }

  private async searchForDeviceId(device_id: string) {
    return await firstValueFrom(
      this.devicesServiceClient.send(DEVICE_MESSAGE_PATTERNS.DEVICE_GET, {
        device_id,
      }),
    );
  }

  public async deleteTokensForDeviceId(device_id: string) {
    const deviceResponse = await this.searchForDeviceId(device_id);

    if (deviceResponse.status !== HttpStatus.OK) return false;

    const deleteTokenResponse = await this.tokenRepository.remove({
      device: deviceResponse.resources.device.id,
    });
    const deleteDeviceResponse = await firstValueFrom(
      this.devicesServiceClient.send(DEVICE_MESSAGE_PATTERNS.DEVICE_REMOVE, {
        device_id,
      }),
    );

    return (
      deleteTokenResponse.deletedCount &&
      deleteDeviceResponse.status === HttpStatus.OK
    );
  }

  public async deleteTokensForRefreshToken(refresh_token: string) {
    const tokenResults = await this.tokenRepository.findOne({ refresh_token });

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
        device_id: deviceResponse.resources.device.device_id,
      }),
    );

    return (
      deleteTokenResponse.deletedCount &&
      deleteDeviceResponse.status === HttpStatus.OK
    );
  }

  public async deleteTokens(
    refresh_token: string,
    device_id?: string,
    user_id?: string,
  ) {
    if (device_id) return this.deleteTokensForDeviceId(device_id);
    if (user_id) return this.deleteTokensForUserId(user_id);

    return this.deleteTokensForRefreshToken(refresh_token);
  }
}
