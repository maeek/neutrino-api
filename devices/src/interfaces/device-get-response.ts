import { HttpStatus } from "@nestjs/common";
import { Device } from "../schemas/device.schema";

export interface IDeviceGetResponse {
  status: HttpStatus;
  resources: {
    device: Device;
  };
  message: string;
  errors?: string;
}
