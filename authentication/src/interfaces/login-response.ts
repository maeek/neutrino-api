import { HttpStatus } from '@nestjs/common';

export interface LoginResponse {
  status: HttpStatus;
  message: string;
  resources?: {
    device: {
      device_id: string;
    };
    user: any;
    accessToken: string;
    refreshToken: string;
  };
  error?: string;
}
