import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@Controller('me')
@ApiTags('me')
export class MeController {
  constructor(
    @Inject('ME_SERVICE')
    private readonly meServiceClient: ClientProxy,
  ) {}

  @Get()
  public async getMe(): Promise<void> {
    return;
  }
}
