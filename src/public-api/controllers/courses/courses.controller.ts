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
import { LocalAuthGuard } from 'src/public-api/authentication/local.auth.guard';

interface CreateCourseResult {
  courseData: string;
}

@Controller()
export class CoursesController {
  private logger = new Logger('TEST');

  constructor(private coursesManagerService: CoursesManagerService) {}

  @Post('courses')
  async createCourse(
    @Body() request: CourseCreateRequest,
    @Res() response: Response,
  ) {
    console.log('TEST');
    const { title, languageId, categoryIds } = request;
    let result: CreateCourseResult;
    try {
      result = await this.coursesManagerService.createCourse(
        title,
        languageId,
        categoryIds,
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
      console.log(error);
      // response.send(error); TODO eliminar
      throw new HttpException(error.details, HttpStatus.BAD_REQUEST);
    }

    return response.send(JSON.parse(result.courseData));
  }
}
