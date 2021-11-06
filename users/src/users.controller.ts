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
    if (!username) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'get_user_bad_request',
        errors: {
          get_user_bad_request: 'username is required',
        },
      };
    }

    const user = await this.usersService.getUserForFrontend({ username });

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'get_user_not_found',
        errors: {
          get_user_not_found: 'User not found',
        },
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'get_user_ok',
      resources: {
        users: [user],
      },
    };
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

  @MessagePattern(MESSAGE_PATTERNS.REMOVE_USER)
  public async removeUser({ username }: { username: string }): Promise<any> {
    if (!username) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'get_user_bad_request',
        errors: {
          get_user_bad_request: 'username is required',
        },
      };
    }

    const removeUser = await this.usersService.deleteUser({ username });

    if (removeUser.deletedCount === 0) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'get_user_bad_request',
        errors: {
          get_user_bad_request: 'user not deleted',
        },
      };
    }

    return {
      status: HttpStatus.NO_CONTENT,
      message: 'get_user_no_content',
    };
  }
}
