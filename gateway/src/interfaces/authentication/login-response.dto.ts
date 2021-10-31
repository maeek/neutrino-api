import { ApiProperty } from '@nestjs/swagger';

class Device {
  @ApiProperty({
    example: 'b89b65d1-b4e5-4974-b0af-4381409970f0',
  })
  deviceId: string;
}

class User {
  @ApiProperty({ example: 'test_user' })
  username: string;

  @ApiProperty({ example: 'user' })
  type: 'user' | 'mod' | 'admin' | string;
}

class Resources {
  @ApiProperty()
  device: Device;

  @ApiProperty()
  user: User;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE2MzU2MTQwNzcsImV4cCI6MTYzNTYxNTI3N30.dt_2K_6iiSpGHKkxC7U7u-5qndh_25F5-H7bkVWDhAw',
  })
  accessToken: string;
}

export class LoginResponse {
  @ApiProperty({ nullable: true, required: false })
  resources?: Resources;

  @ApiProperty({ nullable: true, required: false })
  message?: string;

  @ApiProperty({ nullable: true, required: false })
  errors?: { [key: string]: string };
}

class Errors {
  [errKey: string | number]: string;
}

export class LoginErrorResponse {
  @ApiProperty({ example: 'Invalid credentials' })
  message: string;

  @ApiProperty({
    example: {
      login_bad_request: 'Username or password is incorrect',
      devices_register_bad_request: "Couldn't register device",
    },
  })
  errors: Errors;
}
