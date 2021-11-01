import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@Controller('groups')
@ApiTags('groups')
export class GroupsController {
  constructor(
    @Inject('GROUPS_SERVICE')
    private readonly groupsServiceClient: ClientProxy,
  ) {}

  @Get()
  public async getGroups(): Promise<void> {
    return;
  }
}
