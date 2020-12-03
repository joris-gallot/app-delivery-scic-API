import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayload } from '../../payload/auth';

@Controller()
export class AuthController {
  constructor(private readonly authervice: AuthService) {}

  @Post('login')
  login(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<AuthPayload> {
    if (!email || !password) {
      throw new HttpException(
        'missing email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.authervice.login(email, password);
  }

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<AuthPayload> {
    if (!email || !password) {
      throw new HttpException(
        'missing email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.authervice.register(email, password);
  }
}
