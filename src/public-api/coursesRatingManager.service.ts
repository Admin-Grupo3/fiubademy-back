import { Injectable, Logger } from '@nestjs/common';
import { CoursesRatingService } from './coursesRatings/coursesRating.service';
import { RatingCreateRequest } from './controllers/coursesRatings/dtos/RatingCreateRequest';
import { CoursesRating } from './coursesRatings/coursesRating.entity';

@Injectable()
export class CoursesRatingManagerService {
  private logger = new Logger(this.constructor.name);
  constructor(private readonly courseRatingService: CoursesRatingService) {}

  async updateOrCreateRating(userId: string, courseId: string, rating: number) {
    return await this.courseRatingService.updateOrCreate(
      userId,
      courseId,
      rating,
    );
  }

  async getCourseRatings(course_id: string): Promise<CoursesRating[]> {
    return await this.courseRatingService.getAllById(course_id);
  }
  //async getRating(user_id: string, course_id: string) {
  //  const ratings = await this.courseRatingService.findRatingByUserId(
  //    user_id,
  //    course_id,
  //  );
  //
  //  return {
  //    coursesRatingData: JSON.stringify(ratings),
  //  };
  //}
}
