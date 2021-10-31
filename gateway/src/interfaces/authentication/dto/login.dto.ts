import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

enum LoginStrategy {
  LOCAL = 'local',
}

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ example: 'supersecretpassword' })
  password: string;

  @ApiProperty({ example: 'PC at home' })
  newDeviceName: string;

  @ApiProperty({
    nullable: true,
    required: false,
    enum: LoginStrategy,
    enumName: 'Supported login strategies',
  })
  loginStrategy?: number;
}

export class LoginResponseDto {
  status: HttpStatus;
  message: string;
  resources?: {
    device: {
      deviceId: string;
    };
    user: any;
    accessToken: string;
    refreshToken: string;
  };
  errors: { [key: string]: string };
}
