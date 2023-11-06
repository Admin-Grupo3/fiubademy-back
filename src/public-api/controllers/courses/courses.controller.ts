import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CourseCreateRequest } from './dtos/CourseCreateRequest';
import { Response } from 'express';
import { CoursesManagerService } from 'src/public-api/coursesManager.service';
import { AuthTokenData } from 'src/public-api/authentication/dtos/AuthTokenData.dto';
import { TokenData } from 'src/public-api/authentication/tokenData.decorator';
import { LocalAuthGuard } from 'src/public-api/authentication/local.auth.guard';
import { RolesAccess } from 'src/public-api/roles/roles.decorator';
import { RolesGuard } from 'src/public-api/roles/roles.guard';
import { ROLES } from 'src/public-api/users/users.entity';
import ISO6391 from 'iso-639-1';
import { GetCoursesRequest } from './dtos/GetCoursesRequest.dto';
import { ModifyCoursesRequest } from './dtos/ModifyCoursesRequest.dto';
import { CreateCourseExamDto } from 'src/public-api/courses-exams/dtos/CreateCourseExam';

interface CreateCourseResult {
  courseData: string;
}

@Controller()
export class CoursesController {
  private logger = new Logger(this.constructor.name);

  constructor(private coursesManagerService: CoursesManagerService) {}

  @UseGuards(LocalAuthGuard, RolesGuard)
  @RolesAccess(ROLES.STANDARD_USER)
  @Post('courses')
  async createCourse(
    @Body() request: CourseCreateRequest,
    @TokenData() tokenData: AuthTokenData,
    @Res() response: Response,
  ) {
    this.logger.log('createCourse');
    const { title, language: lang, categoryIds, description, price } = request;
    let result: CreateCourseResult;

    const languageCode = ISO6391.getLanguages([lang]);

    if (!languageCode) {
      throw new HttpException('Language doesnt exists', HttpStatus.BAD_REQUEST);
    }

    try {
      result = await this.coursesManagerService.createCourse(
        title,
        languageCode[0].name.toLowerCase(),
        categoryIds,
        tokenData.email,
        description,
        price
      );
    } catch (error) {
      this.logger.error(error);
      // check connection error
      if (error.code === 14) {
        throw new HttpException(
          'Service Unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      this.logger.warn(error);
      throw new HttpException(error.details, HttpStatus.BAD_REQUEST);
    }
    return response.send(JSON.parse(result.courseData));
  }

  @Get('courses')
  async getCourses(@Body() request: GetCoursesRequest) {
    const { title, category } = request;

    let result;
    try {
      result = await this.coursesManagerService.getCourses(title, category);
    } catch (error) {
      this.logger.error(error);
      // check connection error
      if (error.code === 14) {
        throw new HttpException(
          'Service Unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      this.logger.warn(error);
      throw new HttpException(error.details, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @UseGuards(LocalAuthGuard)
  @Delete('courses/:id')
  async deleteCourse(
    @TokenData() tokenData: AuthTokenData,
    @Param('id') courseId: string,
  ) {
    const userId = tokenData.sub;
    let result;
    try {
      result = await this.coursesManagerService.deleteCourse(userId, courseId);
    } catch (error) {
      this.logger.error(error);
      // check connection error
      if (error.code === 14) {
        throw new HttpException(
          'Service Unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      this.logger.warn(error);
      throw new HttpException(error.details, HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @UseGuards(LocalAuthGuard)
  @Post('courses/:id')
  async updateCourses(
    @TokenData() tokenData: AuthTokenData,
    @Param('id') courseId: string,
    @Body() request: ModifyCoursesRequest,
  ) {
    // check if request doenst have any data
    if (Object.keys(request).length === 0 && request.constructor === Object)
      throw new HttpException(
        'You must provide at least one parameter to update courses',
        HttpStatus.BAD_REQUEST,
      );

    const userId = tokenData.sub;
    let result;
    try {
      result = await this.coursesManagerService.modifyCourse(
        userId,
        courseId,
        request,
      );
    } catch (error) {
      this.logger.error(error);
      // check connection error
      if (error.code === 14) {
        throw new HttpException(
          'Service Unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      this.logger.warn(error);
      throw new HttpException(error.details, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Get('courses/:id/exams')
  async getCourseExams(@Param('id') courseId: string) {
    let result;
    try {
      result = await this.coursesManagerService.getExamsFromCourse(courseId);
    } catch (error) {
      this.logger.error(error);
      // check connection error
      if (error.code === 14) {
        throw new HttpException(
          'Service Unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      this.logger.warn(error);
      throw new HttpException(error.details, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Get('courses/:id/exams/:examId')
  async getCourseExam(
    @Param('id') courseId: string,
    @Param('examId') examId: string,
  ) {
    let result;
    try {
      result = await this.coursesManagerService.getExamFromCourse(
        courseId,
        examId,
      );
    } catch (error) {
      this.logger.error(error);
      // check connection error
      if (error.code === 14) {
        throw new HttpException(
          'Service Unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      this.logger.warn(error);
      throw new HttpException(error.details, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @UseGuards(LocalAuthGuard)
  @Post('courses/:id/exams')
  async createCourseExam(
    @TokenData() tokenData: AuthTokenData,
    @Param('id') courseId: string,
    @Body() request: CreateCourseExamDto,
  ) {
    const userId = tokenData.sub;
    let result;
    try {
      result = await this.coursesManagerService.addExamToCourse(
        userId,
        courseId,
        request,
      );
    } catch (error) {
      this.logger.error(error);
      // check connection error
      if (error.code === 14) {
        throw new HttpException(
          'Service Unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      this.logger.warn(error);
      throw new HttpException(error.details, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @UseGuards(LocalAuthGuard)
  @Delete('courses/:id/exams/:examId')
  async deleteCourseExam(
    @TokenData() tokenData: AuthTokenData,
    @Param('id') courseId: string,
    @Param('examId') examId: string,
  ) {
    const userId = tokenData.sub;
    let result;
    try {
      result = await this.coursesManagerService.deleteExamFromCourse(
        userId,
        courseId,
        examId,
      );
    } catch (error) {
      this.logger.error(error);
      // check connection error
      if (error.code === 14) {
        throw new HttpException(
          'Service Unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );

      }
      this.logger.warn(error);
      throw new HttpException(error.details, HttpStatus.BAD_REQUEST);
    }
    return result;

  }

  @UseGuards(LocalAuthGuard, RolesGuard)
  @RolesAccess(ROLES.STANDARD_USER)
  @Post('courses/:id/purchase')
  async purchaseCourse(
    @Param('id') courseId: string,
    @TokenData() tokenData: AuthTokenData,
    @Res() response: Response,
  ) {
    try {
      const userId = tokenData.sub;
      const result = await this.coursesManagerService.purchaseCourse(userId, courseId);
      return response.send(result);
    } catch (error) {
      this.logger.error(error);
      if (error.code === 14) {
        throw new HttpException('Service Unavailable', HttpStatus.SERVICE_UNAVAILABLE);
      }
      this.logger.warn(error);
      throw new HttpException(error.details, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(LocalAuthGuard, RolesGuard)
  @RolesAccess(ROLES.STANDARD_USER)
  @Get('courses/purchase')
  async getPurchaseCourse(
    @TokenData() tokenData: AuthTokenData,
    @Res() response: Response,
  ) {
    try {
      const userId = tokenData.sub;
      const result = await this.coursesManagerService.getPurchaseCourses(userId);
      return response.send(result);
    } catch (error) {
      this.logger.error(error);
      if (error.code === 14) {
        throw new HttpException('Service Unavailable', HttpStatus.SERVICE_UNAVAILABLE);
      }
      this.logger.warn(error);
      throw new HttpException(error.details, HttpStatus.BAD_REQUEST);
    }
  }
}