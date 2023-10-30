import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CoursesService } from './courses/courses.service';
import { UsersService } from './users/users.service';
import { LanguagesService } from './languages/languages.service';
import { CategoriesService } from './categories/categories.service';

@Injectable()
export class CoursesManagerService {
  private logger = new Logger(this.constructor.name);
  constructor(
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
    private readonly languagesService: LanguagesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async getCourses(title?: string, category?: number) {
    let courses = [];
    if (category) {
      courses = await this.coursesService.findCourseByCategory(category);
      // filter courses by title
      if (title) {
        return courses.filter((course) => course.title.includes(title));
      }
    } else if (title) {
      courses = [await this.coursesService.findByTitle(title)];
    } else {
      courses = (await this.coursesService.findAll()) || [];
    }

    // filter null values
    courses = courses.filter((course) => course !== null);

    return {
      courses,
    };
  }

  async modifyCourse(userId: string, courseId: string, data: any) {
    const course = await this.coursesService.findById(courseId);
    if (!course) {
      throw new HttpException('Course doesnt exists', HttpStatus.BAD_REQUEST);
    }
    // check that the userId is the same as the creator
    if (course.creator.id !== userId) {
      throw new HttpException(
        'You are not the creator of this course',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.coursesService.update(courseId, data);
  }

  async createCourse(
    title: string,
    language: string,
    categoryIds: number[],
    email: string,
  ) {
    this.logger.log(`createCourse: ${title}`);

    let course = await this.coursesService.findByTitle(title);
    if (course) {
      throw new HttpException('Course already exists', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findByEmail(email);

    const lang = await this.languagesService.findByName(language);
    if (!lang) {
      throw new HttpException('Language doesnt exists', HttpStatus.BAD_REQUEST);
    }

    // find categories from the array of ids
    const categories = [];
    categoryIds.forEach(async (categoryId) => {
      const category = await this.categoriesService.findById(categoryId);
      if (!category) {
        throw new HttpException(
          'One of the categories doesnt exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      categories.push(category);
    });

    course = await this.coursesService.create({
      title,
      creator: user,
      language: lang,
      categories,
    });

    const courseData = {
      title,
    };

    return {
      courseData: JSON.stringify(courseData),
    };
  }
}
