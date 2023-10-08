import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserSignInRequest } from './dtos/UserSignInRequest.dto';
import { UserSignUpRequest } from './dtos/UserSignUpRequest.dto';
import { Response } from 'express';
import { UsersService } from 'src/public-api/users.service';
import { LocalAuthGuard } from 'src/public-api/authentication/local.auth.guard';

interface SignIn {
  userData: string;
  token: string;
  tokenMaxAge: string;
}

@Controller()
export class UsersController {
  private logger = new Logger(this.constructor.name);

  constructor(
    private usersService: UsersService,
  ) {}

  @Post('users/signin')
  async signIn(@Body() request: UserSignInRequest, @Res() response: Response) {
    const { email, password } = request;
    let signInRes: SignIn;
    try {
      // TODO SIGN IN USER WITH EMAIL AND PASSWORD
    } catch (error) {
      this.logger.error(error);
      // check connection error
      if (error.code === 14) {
        throw new HttpException(
          'Service Unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      throw new HttpException('Wrong Credentials', HttpStatus.FORBIDDEN);
    }

    const userData = JSON.parse(signInRes.userData);

    const body = { ...userData };

    return this.usersService.returnTokenAsCookie(
      response,
      signInRes.token,
      parseInt(signInRes.tokenMaxAge),
      body,
    );
  }

  @Post('users/signup')
  async signUp(@Body() request: UserSignUpRequest, @Res() response: Response) {
    const { email, password } = request;
    let signInRes: SignIn;
    try {
      // TODO SIGN UP USER WITH EMAIL AND PASSWORD
    } catch (error) {
      this.logger.error(error);
      // check connection error
      if (error.code === 14) {
        throw new HttpException(
          'Service Unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      throw new HttpException(error.details, HttpStatus.BAD_REQUEST);
    }

    const userData = JSON.parse(signInRes.userData);

    const body = { ...userData };

    return this.usersService.returnTokenAsCookie(
      response,
      signInRes.token,
      parseInt(signInRes.tokenMaxAge),
      body,
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('users/logout')
  async logOut(@Res() response: Response) {
    return this.usersService.removeTokenCookie(response);
  }
}
