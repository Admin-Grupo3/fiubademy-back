import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(private readonly jwtService: JwtService) {}
  async validate(token: string): Promise<any> {
    let res;
    try {
      // validate jwt
      res = await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new NotAcceptableException('Wrong Credentials');
    }
    return { valid: true, decoded: res };
  }
}
