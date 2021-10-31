import { Injectable } from '@nestjs/common';
import { DevicesRepository } from '../devices.repository';
import { Device } from '../schemas/device.schema';

@Injectable()
export class DevicesService {
  constructor(private readonly devicesRepository: DevicesRepository) {}

  public registerDevice(name: string, meta: string): Promise<Device> {
    return this.devicesRepository.create({
      name,
      meta,
    });
  }

  public getDevices(deviceId: string | string[]): Promise<Device[]> {
    return this.devicesRepository.find({
      deviceId: {
        $in: [...(typeof deviceId === 'string' ? [deviceId] : [...deviceId])],
      },
    });
  }

  public getDeviceByObjectId(_id: string): Promise<Device> {
    return this.devicesRepository.findOne({ _id });
  }

  public removeDevice(deviceId: string) {
    return this.devicesRepository.remove({ deviceId });
  }

  public renameDevice(deviceId: string, name: string): Promise<any> {
    return this.devicesRepository.findOneAndUpdate({ deviceId }, { name });
  }
}
