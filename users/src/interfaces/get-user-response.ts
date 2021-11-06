import { HttpStatus } from '@nestjs/common';
import { User } from '../schemas/users.schema';

type GetUserResponseOmmited = '_id' | 'hash' | 'role';
export interface GetUserResponse {
  status: HttpStatus;
  message?: string;
  resources?: {
    users: Omit<User, GetUserResponseOmmited>[] | [];
  };
  errors?: { [key: string]: string };
}
