import { HttpStatus } from '@nestjs/common';

export namespace Authentication {
  export namespace Response {
    export interface Login {
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
  }

  export namespace Dto {
    export interface Login {
      username: string;
      password: string;
      device: {
        name: string;
        meta: string;
      };
      loginStrategy?: number; // To be changed to enum, currently only one login strategy
    }

    export interface Logout {
      deviceId?: string;
      refreshToken: string;
      username?: string;
    }
  }
}
