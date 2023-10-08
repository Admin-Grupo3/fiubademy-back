import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { TestRoleRequest } from './dtos/TestRoleRequest.dto';
import { TestRoleResponse } from './dtos/TestRoleResponse.dto';
import { LocalAuthGuard } from 'src/public-api/authentication/local.auth.guard';
import { TokenData } from 'src/public-api/authentication/tokenData.decorator';
import { AuthTokenData } from 'src/public-api/authentication/dtos/AuthTokenData.dto';
import { RolesGuard } from 'src/public-api/roles/roles.guard';
import { RolesAccess } from 'src/public-api/roles/roles.decorator';
import { ROLES } from 'src/public-api/roles/roles';

@Controller()
export class TestsController {
  private logger = new Logger(this.constructor.name);

  @UseGuards(LocalAuthGuard, RolesGuard)
  @RolesAccess(ROLES.STANDARD_USER)
  @Post('test/roles')
  testRole(
    @Body() request: TestRoleRequest,
    @TokenData() tokenData: AuthTokenData,
  ): TestRoleResponse {
    // get role from JWT
    const role = 'test-role';
    this.logger.log(`Testing role: ${role}`);
    return { role };
  }
}
