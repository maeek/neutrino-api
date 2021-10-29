import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = this.authService.validateUserLocal(username, password);

    if (!user)
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'login_bad_request',
        error: 'Username or password is incorrect',
      });

    return user;
  }
}
