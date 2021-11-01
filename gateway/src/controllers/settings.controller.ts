import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@Controller('settings')
@ApiTags('settings')
export class SettingsController {
  constructor(
    @Inject('SETTINGS_SERVICE')
    private readonly settingsServiceClient: ClientProxy,
  ) {}

  @Get()
  public async getSettings(): Promise<void> {
    return;
  }
}
