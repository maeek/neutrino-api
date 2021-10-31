import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponse {}

class Errors {
  [errKey: string | number]: string;
}

export class LogoutErrorResponse {
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
