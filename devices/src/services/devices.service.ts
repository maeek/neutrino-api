import { Injectable } from '@nestjs/common';
import { DevicesRepository } from '../devices.repository';
import { Device } from '../schemas/device.schema';

@Injectable()
export class DevicesService {
  constructor(
    private readonly devicesRepository: DevicesRepository,
  ) {}

  public registerDevice(meta: string): Promise<Device> {
    return this.devicesRepository.create({
      name: 'example',
      meta,
    });
  }

  public getDevice(device_id: string): Promise<Device> {
    return this.devicesRepository.findOne({ device_id });
  }

  public removeDevice(device_id: string) {
    return this.devicesRepository.remove({ device_id });
  }

  public renameDevice(
    device_id: string,
    name: string,
  ): Promise<any> {
    return this.devicesRepository.findOneAndUpdate({ device_id }, { name });
  }
}
