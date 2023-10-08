import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly authenticationService: AuthenticationService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwtToken: string = request.cookies.token;

    if (!jwtToken) {
      return false;
    }

    // Use the UsersManagerService to validate the JWT token.
    const { valid, decoded } = await this.authenticationService.validate(
      jwtToken,
    );

    request.tokenData = decoded;

    return valid;
  }
}
