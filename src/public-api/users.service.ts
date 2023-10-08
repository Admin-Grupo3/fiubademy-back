import { Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class UsersService {
  private logger = new Logger(this.constructor.name);

  returnTokenAsCookie(
    response: Response,
    token: string,
    expiresIn: number,
    body: any,
  ) {
    // send httpOnly cookie
    response.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(Date.now() + 1000 * expiresIn), // 7 days
    });

    response.send(body);
  }

  removeTokenCookie(response: Response) {
    response.clearCookie('token');
    response.send();
  }
}
