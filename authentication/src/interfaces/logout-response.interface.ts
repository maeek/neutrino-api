import { HttpStatus } from '@nestjs/common';

export interface LogoutResponse {
  status: HttpStatus;
  message: string;
  errors?: { [key: string]: string };
}
