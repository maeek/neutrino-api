import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DevicesService } from './services/devices.service';
import { IDeviceResponse } from './interfaces/device-register-response.interface';
import { MESSAGE_PATTERNS } from './constants';
import { IDeviceGetResponse } from './interfaces/device-get-response';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @MessagePattern(MESSAGE_PATTERNS.DEVICE_REGISTER)
  public async registerDevice(data: {
    name: string;
    meta: string;
  }): Promise<IDeviceResponse> {
    let result: IDeviceResponse;
    if (data?.meta) {
      try {
        const createResult = await this.devicesService.registerDevice(
          data.meta,
        );
        const { device_id, id } = createResult as any;

        if (!createResult) {
          result = {
            status: HttpStatus.BAD_REQUEST,
            message: 'device_register_bad_request',
            error: "Couldn't create new device",
          };
        } else {
          result = {
            status: HttpStatus.CREATED,
            message: 'device_register_success',
            resources: {
              device: device_id
                ? {
                    device_id,
                    ref_id: id,
                  }
                : null,
            },
          };
        }
      } catch (e) {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: 'device_register_bad_request',
          resources: {
            device: null,
          },
          error: e?.message,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'device_register_bad_request',
        resources: {
          device: null,
        },
        error: 'Insufficient data to complete the request',
      };
    }

    return result;
  }

  @MessagePattern(MESSAGE_PATTERNS.DEVICE_GET)
  public async getDevices(data: {
    device_id: string | string[];
  }): Promise<IDeviceGetResponse> {
    const devices = await this.devicesService.getDevices(data.device_id);

    if (!devices) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'device_get_not_found',
        error: 'Device not found',
      };
    }

    return {
      status: data?.device_id ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
      message: devices ? 'device_get_success' : 'device_get_bad_request',
      resources: {
        devices,
      },
    };
  }

  @MessagePattern(MESSAGE_PATTERNS.DEVICE_GET_OBJECTID)
  public async getDeviceByObjecId(data: {
    device: string;
  }): Promise<IDeviceGetResponse> {
    const device = await this.devicesService.getDeviceByObjectId(data.device);

    if (!device) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'device_get_not_found',
        error: 'Device not found',
      };
    }

    return {
      status: data?.device ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
      message: device ? 'device_get_success' : 'device_get_bad_request',
      resources: {
        device,
      },
    };
  }

  @MessagePattern(MESSAGE_PATTERNS.DEVICE_REMOVE)
  public async removeDevice(data: { device_id: string }): Promise<any> {
    const device = await this.devicesService.removeDevice(data.device_id);

    return {
      status: data?.device_id ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
      message: device ? 'device_remove_success' : 'device_remove_bad_request',
    };
  }
}
