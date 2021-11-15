import { HttpStatus } from '@nestjs/common';

export namespace Neutrino.Authentication {
  export interface LoginDto {
    username: string;
    password: string;
    device: {
      name: string;
      meta: string;
    };
    loginStrategy?: number; // To be changed to enum, currently only one login strategy
  }

  export interface LoginResponseResources {
    ok: boolean;
    user: {
      username: string;
      type: string;
    };
    accessToken: string;
    refreshToken: string;
  }

  export interface LoginResponse {
    status: HttpStatus;
    message: string;
    resources?: {
      device: {
        deviceId: string;
      };
      user: any;
      accessToken: string;
      refreshToken: string;
    };
    errors?: { [key: string]: string };
  }

  export interface LogoutDto {
    deviceId?: string;
    refreshToken: string;
    username?: string;
  }
}
