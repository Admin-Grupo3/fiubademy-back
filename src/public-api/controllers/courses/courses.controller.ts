import {
  Body,
  Controller,
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
    const { title, language: lang, categoryIds } = request;
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
}
