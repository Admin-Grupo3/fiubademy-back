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
import { Courses } from './courses/courses.entity';
import { Users } from './users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Languages } from './languages/languages.entity';
import { CategoriesController } from './controllers/categories/categories.controller';
import { CategoriesManagerService } from './categoriesManager.service';
import { CoursesExamService } from './courses-exams/courses-exams.service';
import { CoursesExams } from './courses-exams/courses-exams.entity';
import { CoursesQuestions } from './courses-exams/courses-questions/courses-questions.entity';
import { PurchasesService } from './purchases/pruchases.service';
import { Purchases } from './purchases/purchases.entity';
import { LearningPathsController } from './controllers/learning-paths/learning-paths.controller';
import { LearningPathService } from './learning-paths/learning-path.service';
import { LearningPaths } from './learning-paths/learning-paths.entity';
import { LearningPathManagerService } from './learningPathManager.service';

@Module({
  imports: [
    AuthenticationModule,
    TypeOrmModule.forFeature([
      Categories,
      Courses,
      Languages,
      Users,
      CoursesExams,
      CoursesQuestions,
      Purchases,
      LearningPaths,
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRES_IN}s` },
    }),
  ],
  controllers: [
    CoursesController,
    UsersController,
    TestsController,
    CategoriesController,
    LearningPathsController,
  ],
  providers: [
    CategoriesService,
    CoursesManagerService,
    CoursesService,
    LanguagesService,
    UsersManagerService,
    CategoriesManagerService,
    UsersService,
    CoursesExamService,
    PurchasesService,
    LearningPathService,
    LearningPathManagerService,
  ],
  exports: [],
})
export class PublicApiModule {}
