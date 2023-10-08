import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './controllers/users/users.controller';
import { TestsController } from './controllers/test/test.controller';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersService } from './users.service';

@Module({
  imports: [
    AuthenticationModule,
  ],
  controllers: [UsersController, TestsController],
  providers: [UsersService],
  exports: [],
})
export class PublicApiModule {}
