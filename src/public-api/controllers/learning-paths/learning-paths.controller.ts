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
import { Response } from 'express';
import { AuthTokenData } from 'src/public-api/authentication/dtos/AuthTokenData.dto';
import { TokenData } from 'src/public-api/authentication/tokenData.decorator';
import { LocalAuthGuard } from 'src/public-api/authentication/local.auth.guard';
import { RolesAccess } from 'src/public-api/roles/roles.decorator';
import { RolesGuard } from 'src/public-api/roles/roles.guard';
import { ROLES } from 'src/public-api/users/users.entity';
import ISO6391 from 'iso-639-1';
import { LearningPathManagerService } from 'src/public-api/learningPathManager.service';
import { GetLearningPathsRequest } from './dtos/GetLearningPathsRequest';
import { LearningPathCreateRequest } from './dtos/LearningPathCreateRequest';
import { CoursesManagerService } from 'src/public-api/coursesManager.service';

interface CreateLearningPathResult {
  learningPathData: string;
}

@Controller()
export class LearningPathsController {
  private logger = new Logger(this.constructor.name);

  constructor(
    private learningPathManagerService: LearningPathManagerService,
    private readonly coursesManagerService: CoursesManagerService,
    ) {}

  @UseGuards(LocalAuthGuard, RolesGuard)
  @RolesAccess(ROLES.STANDARD_USER)
  @Post('learning-paths')
  async createLearningPath(
    @Body() request: LearningPathCreateRequest,
    @TokenData() tokenData: AuthTokenData,
    @Res() response: Response,
  ) {
    this.logger.log('createLearningPath');
    const { title, description, courses } = request;
    let result: CreateLearningPathResult;

    try {
      result = await this.learningPathManagerService.createLearningPath(
        title,
        description,
        courses,
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
    return response.send(JSON.parse(result.learningPathData));
  }

  @Get('learning-paths')
  async getLearningPaths(@Body() request: GetLearningPathsRequest) {
    const { title } = request;

    let result;
    try {
      result = await this.learningPathManagerService.getLearningPaths(title);
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
  @Post('learning-paths/:id/purchase')
  async purchaseLearningPath(
    @Param('id') learningPathId: string,
    @TokenData() tokenData: AuthTokenData,
    @Res() response: Response,
  ) {
    try {
      const userId = tokenData.sub;

      const result = await this.learningPathManagerService.purchaseLearningPath(
        userId,
        learningPathId,
      );

      await Promise.all(
        result.learningPath.courses.map((course) => {
          return this.coursesManagerService.purchaseCourse(userId, course.id);
        }),
      );

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
  @Get('learning-paths/purchases')
  async getPurchasedLearningPaths(
    @TokenData() tokenData: AuthTokenData,
    @Res() response: Response,
  ) {
    try {
      const userId = tokenData.sub;
      const result =
        await this.learningPathManagerService.getPurchasedLearningPaths(userId);
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
