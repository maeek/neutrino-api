import { HttpStatus } from '@nestjs/common';

export interface IDeviceResponse {
  status: HttpStatus;
  resources: {
    device: {
      device_id: string;
    } | null;
  };
  message: string;
  errors?: string;
}
