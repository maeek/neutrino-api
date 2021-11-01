import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { USERS_MESSAGE_PATTERNS } from '../constants';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE')
    private readonly usersServiceClient: ClientProxy,
  ) {}

  @Post()
  public async createUser(
    @Body() data: { username: string; password: string; type: string },
  ): Promise<any> {
    const { username, password, type } = data || {};

    if (!username || !password || !type) {
      throw new HttpException(
        {
          message: 'create_user_bad_request',
          errors: {
            create_user_bad_request:
              'username, password and type properties are required',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const createUserResponse = await firstValueFrom(
      this.usersServiceClient.send(USERS_MESSAGE_PATTERNS.CREATE_USER, {
        username,
        password,
        type,
      }),
    );

    if (createUserResponse.status !== HttpStatus.CREATED) {
      console.log(createUserResponse);
      throw new HttpException(
        {
          message: 'create_user_bad_request',
          errors: {
            create_user_bad_request: 'Error when creating the user',
            ...createUserResponse.errors,
          },
        },
        createUserResponse.status,
      );
    }

    return {
      resources: createUserResponse.resources,
    };
  }
}
