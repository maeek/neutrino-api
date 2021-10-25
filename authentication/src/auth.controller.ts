import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthenticationService } from './services/auth.service';
import { MESSAGE_PATTERNS } from './constants';

@Controller('authentication')
export class AuthController {
  constructor(private readonly authService: AuthenticationService) {}
  
  @MessagePattern(MESSAGE_PATTERNS.LOGIN)
  public async login() {

  }

  // @MessagePattern('token_create')
  // public async createToken(data: { userId: string }): Promise<ITokenResponse> {
  //   let result: ITokenResponse;

  //   if (data && data.userId) {
  //     try {
  //       const createResult = await this.authService.createToken(data.userId);
  //       result = {
  //         status: HttpStatus.CREATED,
  //         message: 'token_create_success',
  //         token: createResult.token,
  //       };
  //     } catch (e) {
  //       result = {
  //         status: HttpStatus.BAD_REQUEST,
  //         message: 'token_create_bad_request',
  //         token: null,
  //       };
  //     }
  //   } else {
  //     result = {
  //       status: HttpStatus.BAD_REQUEST,
  //       message: 'token_create_bad_request',
  //       token: null,
  //     };
  //   }

  //   return result;
  // }

  // @MessagePattern('token_destroy')
  // public async destroyToken(data: {
  //   userId: string;
  // }): Promise<ITokenDestroyResponse> {
  //   return {
  //     status: data && data.userId ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
  //     message:
  //       data && data.userId
  //         ? (await this.authService.deleteTokenForUserId(data.userId)) &&
  //           'token_destroy_success'
  //         : 'token_destroy_bad_request',
  //     errors: null,
  //   };
  // }

  // @MessagePattern('token_decode')
  // public async decodeToken(data: {
  //   token: string;
  // }): Promise<ITokenDataResponse> {
  //   const tokenData = await this.authService.decodeToken(data.token);
  //   return {
  //     status: tokenData ? HttpStatus.OK : HttpStatus.UNAUTHORIZED,
  //     message: tokenData ? 'token_decode_success' : 'token_decode_unauthorized',
  //     data: tokenData,
  //   };
  // }
}
