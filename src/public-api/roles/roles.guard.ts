import {
  CanActivate,
  ExecutionContext,
  Injectable,
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

    const { tokenData: tokenData_ } = request;
    console.log('tokenData_', tokenData_);

    // parse tokenData from request in try ctach block
    let tokenData: any;
    try {
      tokenData = JSON.parse(tokenData_);
    } catch (error) {
      throw new UnauthorizedException('Unauthorized access');
    }

    if (!tokenData) {
      throw new UnauthorizedException('Unauthorized access');
    }

    const tokenRoles: string[] = tokenData.roles;

    if (!tokenRoles) {
      throw new UnauthorizedException('Unauthorized access');
    }

    const hasRole = () =>
      tokenRoles.some((role: keyof typeof ROLES) => roles.includes(role));

    console.log('hasRole', hasRole());

    return hasRole();
  }
}
