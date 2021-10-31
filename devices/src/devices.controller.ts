import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DevicesService } from './services/devices.service';

import { Device } from './schemas/device.schema';

import { MESSAGE_PATTERNS } from './constants';
import { IDeviceGetResponse } from './interfaces/device-get-response.interface';
import { IDeviceResponse } from './interfaces/device-register-response.interface';
import { DeviceRegisterDto } from './interfaces/dto/device-register.dto';
import { DeviceGetDto } from './interfaces/dto/device-get.dto';
import { DeviceGetByObjectId } from './interfaces/dto/device-get-by-objectid.dto';
import { IDeviceRemoveResponse } from './interfaces/device-remove-response.interface';
import { DeviceRemoveDto } from './interfaces/dto/device-remove-dto';

@Controller('devices')
export class DevicesController {
  private readonly logger = new Logger();

  constructor(private readonly devicesService: DevicesService) {}

  @MessagePattern(MESSAGE_PATTERNS.DEVICE_REGISTER)
  public async registerDevice(
    data: DeviceRegisterDto,
  ): Promise<IDeviceResponse> {
    try {
      const { meta, name } = data || {};

      if (!meta || !name)
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'device_register_bad_request',
          errors: {
            device_register_bad_request:
              'Insufficient data to complete the request',
          },
        };

      const createResult = await this.devicesService.registerDevice(name, meta);
      const { deviceId, id } = (createResult as Device & { id: string }) || {};

      if (!deviceId || !id)
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'device_register_bad_request',
          errors: {
            device_register_bad_request: `devicesService.registerDevice did not return response that match criteria: "${JSON.stringify(
              createResult,
            )}", missing properties: ${['id', 'deviceId']
              .filter((k) => !Object.keys(createResult).includes(k))
              .join(', ')}`,
          },
        };

      return {
        status: HttpStatus.CREATED,
        message: 'device_register_success',
        resources: {
          device: {
            deviceId,
            ref_id: id,
          },
        },
      };
    } catch (e) {
      this.logger.error(e);
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'device_register_bad_request',
        errors: {
          device_register_bad_request: "Couldn't create a new device",
        },
      };
    }
  }

  @MessagePattern(MESSAGE_PATTERNS.DEVICE_GET)
  public async getDevices({
    deviceId,
  }: DeviceGetDto): Promise<IDeviceGetResponse> {
    try {
      if (!deviceId)
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'device_get_bad_request',
          errors: {
            device_get_bad_request: 'deviceId not provided',
          },
        };

      const devices = await this.devicesService.getDevices(deviceId);

      if (!devices)
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'device_get_not_found',
          errors: {
            device_get_not_found: 'Device not found',
          },
        };

      return {
        status: HttpStatus.OK,
        message: 'device_get_success',
        resources: {
          devices,
        },
      };
    } catch (e) {
      this.logger.error(e);
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'device_get_bad_request',
        errors: {
          device_get_bad_request: e?.message || 'Error getting device',
        },
      };
    }
  }

  @MessagePattern(MESSAGE_PATTERNS.DEVICE_GET_OBJECTID)
  public async getDeviceByObjecId({
    device,
  }: DeviceGetByObjectId): Promise<IDeviceGetResponse> {
    try {
      if (!device)
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'device_remove_bad_request',
          errors: {
            device_remove_bad_request:
              'Invalid request, missing "device" property in request body',
          },
        };

      const deviceResponse = await this.devicesService.getDeviceByObjectId(
        device,
      );

      if (!deviceResponse)
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'device_remove_not_found',
          errors: {
            device_remove_not_found: 'Device not found',
          },
        };

      return {
        status: HttpStatus.OK,
        message: 'device_get_success',
        resources: {
          device: deviceResponse,
        },
      };
    } catch (e) {
      this.logger.error(e);
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'device_get_not_found',
        errors: {
          device_get_not_found: e?.message || 'Device not found',
        },
      };
    }
  }

  @MessagePattern(MESSAGE_PATTERNS.DEVICE_REMOVE)
  public async removeDevice({
    deviceId,
  }: DeviceRemoveDto): Promise<IDeviceRemoveResponse> {
    try {
      if (!deviceId)
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'device_remove_bad_request',
          errors: {
            device_remove_bad_request: 'Missing property in request body',
          },
        };

      const deviceDelete = await this.devicesService.removeDevice(deviceId);

      if (!deviceDelete.deletedCount)
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'device_remove_not_found',
          errors: {
            device_remove_not_found: 'No devices were removed',
          },
        };

      return {
        status: HttpStatus.OK,
        message: 'device_remove_success',
      };
    } catch (e) {
      this.logger.error(e);

      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'device_get_bad_request',
        errors: {
          device_get_bad_request: e?.message || 'Error getting device',
        },
      };
    }
  }
}
