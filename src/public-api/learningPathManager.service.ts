import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CoursesService } from './courses/courses.service';
import { UsersService } from './users/users.service';
import { LearningPathService } from './learning-paths/learning-path.service';
import { LearningPathPurchasesService } from './learning-paths-purchases/learningPathPurchases.service';

@Injectable()
export class LearningPathManagerService {
  private logger = new Logger(this.constructor.name);
  constructor(
    private readonly learningPathService: LearningPathService,
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
    private readonly learningPathPurchasesService: LearningPathPurchasesService,
  ) {}

  async getLearningPaths(title?: string) {
    let learningPaths = [];
    if (title) {
      learningPaths = [await this.learningPathService.findByTitle(title)];
    } else {
      learningPaths = (await this.learningPathService.findAll()) || [];
    }

    // filter null values
    learningPaths = learningPaths.filter(
      (learningPath) => learningPath !== null,
    );

    return {
      learningPaths,
    };
  }

  async getPurchasedLearningPaths(userId: string) {
    const leaningPathsIds = await this.learningPathPurchasesService.findByUserId(userId);
    
    const learningPaths = [];

    leaningPathsIds.forEach(async (userLearningPath) => {
      learningPaths.push(userLearningPath.learningPath);
    });

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

  async purchaseLearningPath(userId: string, learningPathId: string) {
    try {
      console.log("USER ID: ");
      console.log(userId);
      console.log("LEARNING PATH ID:");
      console.log(learningPathId);
      const user = await this.usersService.findById(userId);
      const learningPath = await this.learningPathService.findById(
        learningPathId,
      );

      console.log("USER: ");
      console.log(user);
      console.log("LEARNING PATH:");
      console.log(learningPath);

      if (!user) {
        throw new HttpException('User doesnt exists', HttpStatus.BAD_REQUEST);
      }

      if (!learningPath) {
        throw new HttpException('Learning Path doesnt exists', HttpStatus.BAD_REQUEST);
      }

      const alreadyPurchased = user.learningPathPurchases.some(
        (lp) => lp.learningPath.id === learningPathId,
      );

      if (alreadyPurchased) {
        throw new HttpException('Learning Path already purchased', HttpStatus.BAD_REQUEST);
      }

      return await this.learningPathPurchasesService.create({
        learningPath,
        user,
      });
    } catch (error) {
      throw new HttpException(`Error al realizar la compra: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }
}
