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
      user,
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
