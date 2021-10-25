import { Controller, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@Controller('devices')
@ApiTags('devices')
export class AuthenticationController {
  constructor(
    @Inject('AUTHENTICATION_SERVICE')
    private readonly authenticationServiceClient: ClientProxy,
  ) {}

  // @Post()
  // @ApiOkResponse({
  //   type: GetUserByTokenResponseDto,
  // })
  // public async registerDevice(@Req() request: Request): Promise<any> {
  //   const meta = request.headers['user-agent'];
  //   const name = 'test name';

  //   const devicesResponse: any = await firstValueFrom(
  //     this.authenticationServiceClient.send(DEVICE_MESSAGE_PATTERNS.DEVICE_REGISTER, {
  //       name,
  //       meta,
  //     }),
  //   );

  //   if (devicesResponse.status !== HttpStatus.CREATED) {
  //     throw new HttpException(
  //       {
  //         message: devicesResponse.message,
  //         data: null,
  //         errors: devicesResponse.errors,
  //       },
  //       devicesResponse.status,
  //     );
  //   }

  //   return {
  //     resources: {
  //       device: devicesResponse.resources.device,
  //     },
  //     errors: devicesResponse?.error,
  //   };
  // }

  // @Get('/:device_id')
  // @ApiOkResponse({
  //   type: GetUserByTokenResponseDto,
  // })
  // public async getDevice(@Param('device_id') device_id: string): Promise<any> {
  //   const devicesResponse: any = await firstValueFrom(
  //     this.authenticationServiceClient.send(DEVICE_MESSAGE_PATTERNS.DEVICE_GET, {
  //       device_id,
  //     }),
  //   );

  //   return {
  //     resources: {
  //       device: devicesResponse.resources,
  //     },
  //     errors: devicesResponse?.error,
  //   };
  // }

  // @Delete('/:device_id')
  // @ApiOkResponse({
  //   type: GetUserByTokenResponseDto,
  // })
  // public async removeDevice(
  //   @Param('device_id') device_id: string,
  // ): Promise<any> {
  //   const devicesResponse: any = await firstValueFrom(
  //     this.authenticationServiceClient.send(DEVICE_MESSAGE_PATTERNS.DEVICE_REMOVE, {
  //       device_id,
  //     }),
  //   );

  //   return {
  //     errors: devicesResponse?.error,
  //   };
  // }
}
