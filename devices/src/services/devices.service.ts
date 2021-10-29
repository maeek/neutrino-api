import { Injectable } from '@nestjs/common';
import { DevicesRepository } from '../devices.repository';
import { Device } from '../schemas/device.schema';

@Injectable()
export class DevicesService {
  constructor(private readonly devicesRepository: DevicesRepository) {}

  public registerDevice(meta: string): Promise<Device> {
    return this.devicesRepository.create({
      name: 'example',
      meta,
    });
  }

  public getDevices(device_id: string | string[]): Promise<Device[]> {
    return this.devicesRepository.find({
      device_id: {
        $in: [
          ...(typeof device_id === 'string' ? [device_id] : [...device_id]),
        ],
      },
    });
  }

  public getDeviceByObjectId(_id: string): Promise<Device> {
    return this.devicesRepository.findOne({ _id });
  }

  public removeDevice(device_id: string) {
    return this.devicesRepository.remove({ device_id });
  }

  public renameDevice(device_id: string, name: string): Promise<any> {
    return this.devicesRepository.findOneAndUpdate({ device_id }, { name });
  }
}
