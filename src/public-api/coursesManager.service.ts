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

  async createCourse(title: string, languageId: number, categoryIds) {
    this.logger.log(`createCourse: ${title}`);

    let course = await this.coursesService.findByTitle(title);
    if (course) {
      throw new HttpException('Course already exists', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findById(
      '9d5d90e8-979e-4dff-8d8d-17f79408f08c',
    ); // TODO: obtener a partir de JWT

    const language = await this.languagesService.findById(languageId);
    if (!language) {
      throw new HttpException('Language doesnt exists', HttpStatus.BAD_REQUEST);
    }

    const categories = categoryIds.map(async (categoryId) => {
      await this.categoriesService.findById(categoryId);
    });
    if (categories.contains(null)) {
      throw new HttpException(
        'One of the categories doesnt exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    course = await this.coursesService.create({
      title,
      user,
      language,
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
