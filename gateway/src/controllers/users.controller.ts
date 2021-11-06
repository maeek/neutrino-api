import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Response,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Response as EResponse } from 'express';
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
      resources: {
        users: createUserResponse.resources.users.map((user) => ({
          ...user,
          id: undefined,
        })),
      },
    };
  }

  @Get('/:username')
  public async getUser(@Param('username') username: string): Promise<any> {
    if (!username) {
      throw new HttpException(
        {
          message: 'get_user_bad_request',
          errors: {
            get_user_bad_request: 'username property is required',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await firstValueFrom(
      this.usersServiceClient.send(USERS_MESSAGE_PATTERNS.GET_USER, {
        username,
      }),
    );

    if (user.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: 'get_user_bad_request',
          errors: {
            get_user_bad_request: 'Error when getting the user',
            ...user.errors,
          },
        },
        user.status,
      );
    }

    return {
      resources: {
        users: user.resources.users,
      },
    };
  }

  @Delete('/:username')
  public async removeUser(
    @Param('username') username: string,
    @Response() res: EResponse,
  ): Promise<any> {
    if (!username) {
      throw new HttpException(
        {
          message: 'delete_user_bad_request',
          errors: {
            delete_user_bad_request: 'username property is required',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const removeUserResponse = await firstValueFrom(
      this.usersServiceClient.send(USERS_MESSAGE_PATTERNS.REMOVE_USER, {
        username,
      }),
    );

    if (removeUserResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: 'delete_user_bad_request',
          errors: {
            delete_user_bad_request: 'Error when deleting the user',
            ...removeUserResponse.errors,
          },
        },
        removeUserResponse.status,
      );
    }

    return res.status(HttpStatus.OK).json({});
  }
}
