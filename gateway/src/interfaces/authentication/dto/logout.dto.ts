import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({
    nullable: true,
    required: false,
    example: '0da0e1c8-ca27-4beb-b760-7d01841feb8a',
  })
  deviceId?: string;

  @ApiProperty({
    nullable: true,
    required: false,
    example: 'test_user',
  })
  username?: string;
}
