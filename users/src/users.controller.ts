import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { UsersService } from './services/users.service';
import { GetUserResponse } from './interfaces/get-user-response';
import { MESSAGE_PATTERNS } from './constants';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(MESSAGE_PATTERNS.GET_USER)
  public async getUser({
    username,
  }: {
    username: string;
  }): Promise<GetUserResponse> {
    let result: GetUserResponse;

    if (!username) {
    }

    // const user = await this.usersService.getUserForFrontend({ username });

    return result;
  }

  // TODO: input serialization
  @MessagePattern(MESSAGE_PATTERNS.CREATE_USER)
  public async createUser(newUser: any): Promise<any> {
    const { username, password, type } = newUser;

    if (!username || !password || !type) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'create_user_bad_request',
        errors: {
          create_user_bad_request:
            'username, password and type properties are required',
        },
      };
    }

    const newUserResponse = await this.usersService.createUser(newUser);

    if (!newUserResponse.username || newUserResponse.exists) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'create_user_bad_request',
        errors: {
          create_user_bad_request: newUserResponse.exists
            ? 'Username taken'
            : 'username, password and type properties are required',
        },
      };
    }

    return {
      status: HttpStatus.CREATED,
      message: 'create_user_created',
      resources: {
        users: [
          {
            ...newUserResponse.toObject(),
            hash: undefined,
          },
        ],
      },
    };
  }
}
