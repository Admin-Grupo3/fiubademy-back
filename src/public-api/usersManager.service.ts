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
import { sha256 } from 'js-sha256';
import { CategoriesService } from './categories/categories.service';

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
    private readonly categoriesService: CategoriesService,
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
    const salt = process.env.SALT_HASH;
    const isMatch = (await sha256(password + salt)) === user.password;
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

  async signUpUser(email: string, password: string, firstName: string, lastName: string) {
    this.logger.log(`signUpUser: ${email}`);
    let user = await this.usersService.findByEmail(email);

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    // hash password before saving
    const salt = process.env.SALT_HASH;
    password = await sha256(password + salt);

    user = await this.usersService.create({
      email,
      password,
      firstName,
      lastName
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

  changePassword(userId: string, oldPassword: string, newPassword: string) {
    this.logger.log(`changePassword: ${userId}`);
    return this.usersService.changePassword(userId, oldPassword, newPassword);
  }

  async profile(userId: string) {
    this.logger.log(`profile: ${userId}`);
    const user = await this.usersService.findById(userId);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      interests: user.interests,
      roles: user.roles as unknown as string[],
    };
  }

  async changeProfile(userId: string, firstName: string, lastName: string, birthDate: Date, interests: number[]) {
    this.logger.log(`changeProfile: ${userId}`);
    const categories = [];
    for (const categoryId of interests) {
      const category = await this.categoriesService.findById(categoryId);
      if (!category) {
        throw new HttpException(
          'One of the categories doesnt exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      categories.push(category);
    };
    return this.usersService.changeProfile(userId, firstName, lastName, birthDate, categories);
  }
}
