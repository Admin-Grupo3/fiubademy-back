import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CoursesService } from './courses/courses.service';
import { UsersService } from './users/users.service';
import { LearningPathService } from './learning-paths/learning-path.service';

@Injectable()
export class LearningPathManagerService {
  private logger = new Logger(this.constructor.name);
  constructor(
    private readonly learningPathService: LearningPathService,
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
  ) {}

  async getLearningPaths(title?: string) {
    let learningPaths = [];
    if (title) {
      learningPaths = [await this.coursesService.findByTitle(title)];
    } else {
      learningPaths = (await this.coursesService.findAll()) || [];
    }

    // filter null values
    learningPaths = learningPaths.filter(
      (learningPath) => learningPath !== null,
    );

    return {
      learningPaths,
    };
  }

  async createLearningPath(
    title: string,
    description: string,
    coursesIds: string[],
    email: string,
  ) {
    this.logger.log(`createLearningPath: ${title}`);

    let learningPath = await this.learningPathService.findByTitle(title);
    if (learningPath) {
      throw new HttpException(
        'Learning Path already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new HttpException('User doesnt exist', HttpStatus.BAD_REQUEST);
    }

    const coursesPromises = coursesIds.map(async (courseId) => {
      const course = await this.coursesService.findById(courseId);
      if (!course) {
        throw new HttpException(
          'One of the courses doesnt exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      return course;
    });

    const courses = await Promise.all(coursesPromises);

    learningPath = await this.learningPathService.create({
      title,
      description,
      courses: courses,
      creator: user,
    });

    const learningPathData = {
      title,
      description,
      courses: courses,
    };

    return {
      learningPathData: JSON.stringify(learningPathData),
    };
  }
}
