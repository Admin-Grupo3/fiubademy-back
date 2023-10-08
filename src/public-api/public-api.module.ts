import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { TestsController } from './controllers/test/test.controller';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersManagerService } from './usersManager.service';

@Module({
  imports: [AuthenticationModule],
  controllers: [UsersController, TestsController],
  providers: [UsersManagerService],
  exports: [],
})
export class PublicApiModule {}
