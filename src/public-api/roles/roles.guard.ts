import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES } from './roles';
import { Request } from 'express';

interface InterceptedRequest extends Request {
  tokenData?: any;
}

@Injectable()
export class RolesGuard implements CanActivate {
  private logger = new Logger(this.constructor.name);
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Array<keyof typeof ROLES>>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<InterceptedRequest>();

    const { tokenData: tokenData } = request;

    if (!tokenData) {
      this.logger.error(`Error tokenData is empty`);
      throw new UnauthorizedException('Unauthorized access');
    }

    const tokenRoles: string[] = tokenData.roles;

    if (!tokenRoles) {
      this.logger.error(`Error tokenRoles is empty`);
      throw new UnauthorizedException('Unauthorized access');
    }

    const hasRole = () =>
      tokenRoles.some((role: keyof typeof ROLES) => roles.includes(role));

    console.log('hasRole', hasRole());

    return hasRole();
  }
}
