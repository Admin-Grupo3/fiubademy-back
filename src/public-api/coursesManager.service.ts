import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CoursesService } from './courses/courses.service';
import { UsersService } from './users/users.service';
import { LanguagesService } from './languages/languages.service';
import { CategoriesService } from './categories/categories.service';
import { CreateCourseExamDto } from './courses-exams/dtos/CreateCourseExam';
import { PurchasesService } from './purchases/purchases.service';
import ISO6391 from 'iso-639-1';
import { answer } from './controllers/users/dtos/ExamTakeRequest.dto';

@Injectable()
export class CoursesManagerService {
  private logger = new Logger(this.constructor.name);
  constructor(
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
    private readonly languagesService: LanguagesService,
    private readonly categoriesService: CategoriesService,
    private readonly purchasesService: PurchasesService,
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

    const language = ISO6391.getLanguages([
      data.language,
    ])[0].name.toLowerCase();
    const lang = await this.languagesService.findByName(language);
    if (!lang) {
      throw new HttpException('Language doesnt exists', HttpStatus.BAD_REQUEST);
    }
    data.language = lang;

    const categories = [];
    for (const categoryId of data.categoryIds) {
      const category = await this.categoriesService.findById(categoryId);
      if (!category) {
        throw new HttpException(
          'One of the categories doesnt exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      categories.push(category);
    }
    data.categoryIds = categories;
    return await this.coursesService.update(courseId, data);
  }

  async createCourse(
    title: string,
    language: string,
    categoryIds: number[],
    email: string,
    description: string,
    price: number,
    what_will_you_learn: string[],
    content: string[],
    video: string,
    companyName?: string,
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
    for (const categoryId of categoryIds) {
      const category = await this.categoriesService.findById(categoryId);
      if (!category) {
        throw new HttpException(
          'One of the categories doesnt exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      categories.push(category);
    }

    course = await this.coursesService.create({
      title,
      creator: user,
      language: lang,
      categories,
      description,
      price,
      what_will_you_learn,
      content,
      video,
      companyName,
    });

    const courseData = {
      title,
    };

    return {
      courseData: JSON.stringify(courseData),
    };
  }

  async deleteCourse(userId: string, courseId: string) {
    this.logger.log(`deleteCourse: ${courseId}`);
    // check that the userId is the same as the creator
    await this.checkUserIsCreatorOfCourse(userId, courseId);
    return this.coursesService.delete(courseId);
  }

  async checkUserIsCreatorOfCourse(userId: string, courseId: string) {
    const course = await this.coursesService.findById(courseId);
    if (!course) {
      throw new HttpException('Course doesnt exists', HttpStatus.BAD_REQUEST);
    }
    if (course.creator.id !== userId) {
      throw new HttpException(
        'You are not the creator of this course',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async addExamToCourse(
    userId: string,
    courseId: string,
    examData: CreateCourseExamDto,
  ) {
    this.logger.log(`addExamToCourse: ${courseId} for user id:  ${userId}`);
    // check  that the user is the creator of this course
    await this.checkUserIsCreatorOfCourse(userId, courseId);
    const course = await this.coursesService.addExam(courseId, examData);

    // filter from questions the correct answer
    course.exams = course.exams.map((exam) =>
      this.proxyFilterCorrectAnswerFromExam(exam),
    );

    return course;
  }

  proxyFilterCorrectAnswerFromExam(exam: any) {
    console.log(exam);
    exam.questions.forEach((question) => {
      delete question.correctAnswerId;
    });
    return exam;
  }

  async getExamsFromCourse(courseId: string) {
    this.logger.log(`getExams: ${courseId}`);
    const exams_ = await this.coursesService.getExams(courseId);

    const exams = exams_.map((exam) =>
      this.proxyFilterCorrectAnswerFromExam(exam),
    );
    return {
      exams,
    };
  }

  async correctExamFromCourse(
    userId: string,
    courseId: string,
    examId: string,
    answers: answer[],
  ) {
    this.logger.log(`correctExam: ${courseId}`);
    const course = await this.coursesService.findById(courseId);
    if (!course) {
      throw new HttpException('Course doesnt exists', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new HttpException('User doesnt exists', HttpStatus.BAD_REQUEST);
    }

    const exam = await this.coursesService.correctExam(
      courseId,
      examId,
      answers,
    );
    if (exam.avgScore >= 0.6) {
      await this.usersService.addCourseCompleted(
        userId,
        courseId,
        course.title,
        exam.avgScore,
      );
    }
    // add exam to user
    await this.usersService.addExamTaken(
      userId,
      examId,
      exam.examName,
      exam.avgScore,
    );

    return {
      exam,
    };
  }

  async getExamFromCourse(courseId: string, examId: string) {
    this.logger.log(`getExam: ${courseId}`);
    const exam = await this.coursesService.getExam(courseId, examId);
    // filter from questions the correct answer
    exam?.questions.forEach((question) => {
      delete question.correctAnswerId;
    });
    return {
      exam,
    };
  }

  async deleteExamFromCourse(userId: string, courseId: string, examId: string) {
    this.logger.log(`deleteExam: ${courseId}`);
    await this.checkUserIsCreatorOfCourse(userId, courseId);
    return await this.coursesService.deleteExam(courseId, examId);
  }
  async purchaseCourse(userId: string, courseId: string) {
    try {
      const user = await this.usersService.findById(userId);
      const course = await this.coursesService.findById(courseId);

      if (!user) {
        throw new HttpException('User doesnt exists', HttpStatus.BAD_REQUEST);
      }

      if (!course) {
        throw new HttpException('Course doesnt exists', HttpStatus.BAD_REQUEST);
      }

      const alreadyPurchased = user.purchases.some(
        (c) => c.course.id === courseId,
      );

      console.log('Course:', course);

      if (alreadyPurchased) {
        throw new HttpException(
          'Course already purchased',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.purchasesService.create({
        course,
        user,
      });
    } catch (error) {
      throw new HttpException(
        `Error al realizar la compra: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getPurchaseCourses(userId: string) {
    const coursesIds = await this.purchasesService.findByUserId(userId);

    const courses = [];

    coursesIds.forEach(async (userCourse) => {
      courses.push(userCourse.course);
    });

    return {
      courses,
    };
  }
}
