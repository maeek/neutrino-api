import { HttpStatus } from '@nestjs/common';
import { User } from '../schemas/user.schema';

type GetUserResponseOmmited = '_id' | 'hash' | 'role';
export interface GetUserResponse {
  status: HttpStatus;
  message?: string;
  resources: {
    user: Omit<User, GetUserResponseOmmited> | null;
  };
  error?: string;
}
