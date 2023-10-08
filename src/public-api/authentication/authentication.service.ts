import { Injectable, NotAcceptableException } from '@nestjs/common';

@Injectable()
export class AuthenticationService {
  constructor() {}
  async validate(token: string): Promise<any> {
    let res;
    try {
      // TODO: VALIDATE JWT TOKEN
    } catch (error) {
      throw new NotAcceptableException('Wrong Credentials');
    }
    return res;
  }
}
