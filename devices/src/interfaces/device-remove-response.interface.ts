import { HttpStatus } from '@nestjs/common';

export interface IDeviceRemoveResponse {
  status: HttpStatus;
  message: string;
  errors?: { [key: string]: string };
}
