import { HttpStatus } from '@nestjs/common';

export interface LoginResponseResources {
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
