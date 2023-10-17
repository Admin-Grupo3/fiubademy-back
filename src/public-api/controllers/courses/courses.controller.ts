import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
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

    console.log('lang', lang);
    const languageCode = ISO6391.getLanguages([lang]);

    console.log('languageCode', languageCode);
    if (!languageCode) {
      throw new HttpException('Language doesnt exists', HttpStatus.BAD_REQUEST);
    }

    this.logger.log('tokenData', tokenData);

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
}
