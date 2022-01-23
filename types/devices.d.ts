import { HttpStatus } from '@nestjs/common';

export namespace Devices {
  export interface Device {
    readonly deviceId: string;
    name: string;
    timestamp: number;
    meta: string;
  }

  export namespace Response {
    export interface DeviceGet {
      status: HttpStatus;
      resources?: {
        device?: Device;
        devices?: Device[];
      };
      message: string;
      errors?: { [key: string]: string };
    }

    export interface DeviceRegister {
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

    export interface DeviceRemove {
      status: HttpStatus;
      message: string;
      errors?: { [key: string]: string };
    }
  }

  export namespace Dto {
    export class DeviceRegister {
      name: string;
      meta: string;
    }

    export class DeviceGetByObjectId {
      device: string;
    }

    export class DeviceGet {
      deviceId: string | string[];
    }

    export class DeviceRemove {
      deviceId: string;
    }
  }
}
