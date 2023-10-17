import { Module } from '@nestjs/common';
import { CoursesController } from './controllers/courses/courses.controller';
import { UsersController } from './controllers/users/users.controller';
import { TestsController } from './controllers/test/test.controller';
import { AuthenticationModule } from './authentication/authentication.module';
import { CoursesManagerService } from './coursesManager.service';
import { UsersManagerService } from './usersManager.service';
import { JwtModule } from '@nestjs/jwt';
import { CategoriesService } from './categories/categories.service';
import { CoursesService } from './courses/courses.service';
import { LanguagesService } from './languages/languages.service';
import { UsersService } from './users/users.service';
import { Categories } from './categories/categories.entity';
import { Courses, Languages } from './courses/courses.entity';
import { Users } from './users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AuthenticationModule,
    TypeOrmModule.forFeature([Categories, Courses, Languages, Users]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRES_IN}s` },
    }),
  ],
  controllers: [CoursesController, UsersController, TestsController],
  providers: [
    CategoriesService,
    CoursesManagerService,
    CoursesService,
    LanguagesService,
    UsersManagerService,
    UsersService,
  ],
  exports: [],
})
export class PublicApiModule {}
