import { HttpStatus } from '@nestjs/common';

export interface IDeviceResponse {
  status: HttpStatus;
  resources?: {
    device: {
      deviceId: string;
      ref_id: string;
    };
  };
  message: string;
  errors?: { [key: string]: string };
}
