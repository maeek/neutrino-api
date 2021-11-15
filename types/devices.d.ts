import { HttpStatus } from '@nestjs/common';

export namespace Neutrino.Devices {
  export interface Device {
    readonly deviceId: string;
    name: string;
    timestamp: number;
    meta: string;
  }

  export interface IDeviceGetResponse {
    status: HttpStatus;
    resources?: {
      device?: Device;
      devices?: Device[];
    };
    message: string;
    errors?: { [key: string]: string };
  }
}
