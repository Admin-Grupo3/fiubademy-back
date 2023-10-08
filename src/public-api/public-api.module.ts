import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { TestsController } from './controllers/test/test.controller';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersManagerService } from './usersManager.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { Users } from './users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AuthenticationModule,
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRES_IN}s` },
    }),
  ],
  controllers: [UsersController, TestsController],
  providers: [UsersManagerService, UsersService],
  exports: [],
})
export class PublicApiModule {}
