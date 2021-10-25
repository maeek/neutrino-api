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
        const { device_id } = createResult;

        result = {
          status: HttpStatus.CREATED,
          message: 'device_register_success',
          resources: {
            device: device_id ? { device_id } : null
          }
        };
      } catch (e) {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: 'device_register_bad_request',
          resources: {
            device: null
          },
          errors: e?.message,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'device_register_bad_request',
        resources: {
          device: null
        },
        errors: 'Insufficient data to complete the request',
      };
    }

    return result;
  }

  @MessagePattern(MESSAGE_PATTERNS.DEVICE_GET)
  public async getDevice(data: { device_id: string }): Promise<IDeviceGetResponse> {
    const device = await this.devicesService.getDevice(data.device_id);

    return {
      status: data?.device_id ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
      message: device ? 'device_get_success' : 'device_get_bad_request',
      resources: {
        device,
      },
      errors: null,
    };
  }

  @MessagePattern(MESSAGE_PATTERNS.DEVICE_REMOVE)
  public async removeDevice(data: { device_id: string }): Promise<any> {
    const device = await this.devicesService.removeDevice(data.device_id);

    return {
      status: data?.device_id ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
      message: device ? 'device_remove_success' : 'device_remove_bad_request',
      errors: null,
    };
  }
}
