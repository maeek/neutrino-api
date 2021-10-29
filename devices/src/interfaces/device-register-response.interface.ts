import { HttpStatus } from '@nestjs/common';

export interface IDeviceResponse {
  status: HttpStatus;
  resources?: {
    device: {
      device_id: string;
      ref_id: string;
    };
  };
  message: string;
  error?: string;
}
