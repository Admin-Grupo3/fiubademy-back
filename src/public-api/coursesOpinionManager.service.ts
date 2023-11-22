import { Injectable, Logger } from '@nestjs/common';
import { CoursesOpinionsService } from './courseOpinions/courseOpinions.service';
import { CoursesRating } from './coursesRatings/coursesRating.entity';
import { CoursesOpinions } from './courseOpinions/courseOpinions.entity';

@Injectable()
export class CoursesOpinionManagerService {
  private logger = new Logger(this.constructor.name);
  constructor(
    private readonly coursesOpinionsService: CoursesOpinionsService,
  ) {}

  async updateOrCreateOpinion(userId, courseId, opinion) {
    return await this.coursesOpinionsService.updateOrCreate(
      userId,
      courseId,
      opinion,
    );
  }

  async getCourseOpinions(course_id: string): Promise<CoursesOpinions[]> {
    return await this.coursesOpinionsService.getAllById(course_id);
  }
  //async getOpinion(user_id: string, course_id: string) {
  //  const opinions = await this.coursesOpinionsService.findOpinionByUserId(
  //    user_id,
  //    course_id,
  //  );
  //
  //  return {
  //    courseOpinionData: JSON.stringify(opinions),
  //  };
  //}
}
