import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@Controller('messages')
@ApiTags('messages')
export class MessagesController {
  constructor(
    @Inject('MESSAGES_SERVICE')
    private readonly messagesServiceClient: ClientProxy,
  ) {}

  @Get()
  public async getMessages(): Promise<void> {
    return;
  }
}
