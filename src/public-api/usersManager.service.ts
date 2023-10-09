import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ROLES } from './users/users.entity';
import * as bcrypt from 'bcrypt';

export class AuthPayloadDto {
  sub: string;
  email: string;
  roles: keyof (typeof ROLES)[];
}

@Injectable()
export class UsersManagerService {
  private logger = new Logger(this.constructor.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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

  async signInUser(email: string, password: string) {
    this.logger.log(`signInUser: ${email}`);
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const roles = user.roles as unknown as keyof (typeof ROLES)[];

    const payload: AuthPayloadDto = {
      sub: user.id,
      email: user.email,
      roles,
    };

    const userData = {
      email,
      roles,
    };

    return {
      token: await this.jwtService.signAsync(payload),
      tokenMaxAge: process.env.JWT_EXPIRES_IN,
      userData: JSON.stringify(userData),
    };
  }

  async signUpUser(email: string, password: string) {
    this.logger.log(`signUpUser: ${email}`);
    let user = await this.usersService.findByEmail(email);

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    // hash password before saving
    const salt = await bcrypt.genSalt(process.env.SALT_HASH || 10);
    password = await bcrypt.hash(password, salt);

    user = await this.usersService.create({
      email,
      password,
    });

    const roles = user.roles as unknown as keyof (typeof ROLES)[];

    const payload: AuthPayloadDto = {
      sub: user.id,
      email: user.email,
      roles,
    };

    const userData = {
      email,
      roles,
    };

    return {
      token: await this.jwtService.signAsync(payload),
      tokenMaxAge: process.env.JWT_EXPIRES_IN,
      userData: JSON.stringify(userData),
    };
  }
}
