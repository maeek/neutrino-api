import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevicesController } from './devices.controller';
import { DevicesService } from './services/devices.service';
import { MongoConfigService } from './services/config/mongo-config.service';
import { Device, DeviceSchema } from './schemas/device.schema';
import { DevicesRepository } from './devices.repository';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    MongooseModule.forFeature([
      {
        name: Device.name,
        schema: DeviceSchema,
      },
    ]),
  ],
  controllers: [DevicesController],
  providers: [DevicesService, DevicesRepository],
})
export class DevicesModule {}
