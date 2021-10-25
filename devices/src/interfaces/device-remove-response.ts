import { HttpStatus } from "@nestjs/common";

export interface IDeviceGetResponse {
  status: HttpStatus;
  message: string;
  errors?: string;
}
