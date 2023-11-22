import {
  Body,
  ConsoleLogger,
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
import { Response } from 'express';
import { AuthTokenData } from 'src/public-api/authentication/dtos/AuthTokenData.dto';
import { TokenData } from 'src/public-api/authentication/tokenData.decorator';
import { LocalAuthGuard } from 'src/public-api/authentication/local.auth.guard';
import { RolesAccess } from 'src/public-api/roles/roles.decorator';
import { RolesGuard } from 'src/public-api/roles/roles.guard';
import { ROLES } from 'src/public-api/users/users.entity';
import ISO6391 from 'iso-639-1';
import { CoursesRatingManagerService } from 'src/public-api/coursesRatingManager.service';
import { CoursesOpinionManagerService } from 'src/public-api/coursesOpinionManager.service';
import { RatingCreateRequest } from './dtos/RatingCreateRequest';
import { CoursesOpinions } from 'src/public-api/courseOpinions/courseOpinions.entity';
import { CoursesRating } from 'src/public-api/coursesRatings/coursesRating.entity';

interface GetRatingResult {
  courseRatingData: Array<[number, string]>;
  courseOpinionsData: Array<[string, string]>;
}

@Controller()
export class CoursesRatingController {
  private logger = new Logger(this.constructor.name);

  constructor(
    private coursesRatingManagerService: CoursesRatingManagerService,
    private coursesOpinionsManagerService: CoursesOpinionManagerService,
  ) {}

  @UseGuards(LocalAuthGuard, RolesGuard)
  @RolesAccess(ROLES.STANDARD_USER)
  @Post('rating')
  async createOrUpdateRating(
    @Body() request: RatingCreateRequest,
    @TokenData() tokenData: AuthTokenData,
    @Res() response: Response,
  ) {
    this.logger.log('createOrUpdateCourseRating');
    const { courseId, rating, opinion } = request;
    const userId = tokenData.sub;

    try {
      if (rating) {
        await this.coursesRatingManagerService.updateOrCreateRating(
          userId,
          courseId,
          parseInt(rating),
        );
      }
      if (opinion) {
        await this.coursesOpinionsManagerService.updateOrCreateOpinion(
          userId,
          courseId,
          opinion,
        );
      }
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
    return response.sendStatus(200);
  }

  @Get('rating/:id')
  async getRatings(
    @Res() response: Response,
    @Param('id') courseId: string,
    @TokenData() tokenData: AuthTokenData,
  ) {
    let result: GetRatingResult;
    let opinions: CoursesOpinions[] = [];
    let ratings: CoursesRating[] = [];
    try {
      opinions = await this.coursesOpinionsManagerService.getCourseOpinions(
        courseId,
      );
      ratings = await this.coursesRatingManagerService.getCourseRatings(
        courseId,
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

    const opinionsArray = opinions.map((opinionEntity) => ({
      opinion: opinionEntity.opinion,
      user_id: opinionEntity.user.id,
    }));
    const ratingsArray = ratings.map((ratingEntity) => ({
      rating_star: ratingEntity.rating_star,
      user_id: ratingEntity.user.id,
    }));

    const ratingData = {
      opinionsArray,
      ratingsArray,
    };

    return response.send(JSON.parse(JSON.stringify(ratingData)));
  }
}
