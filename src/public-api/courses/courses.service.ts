import { Injectable } from '@nestjs/common';
import { Courses } from './courses.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCourseDto } from './dtos/createCourse.dto';
import { CoursesExamService } from '../courses-exams/courses-exams.service';
import { CreateCourseExamDto } from '../courses-exams/dtos/CreateCourseExam';
import { Company } from '../company/company.entity';
import { PurchasesService } from '../purchases/purchases.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private purchaseService: PurchasesService,
    private coursesExamService: CoursesExamService,
  ) {}

  async create(body: CreateCourseDto) {
    let company = undefined;
    if (body.companyName !== '') {
      const companyDb = await this.companyRepository.findOne({
        where: { title: body.companyName },
      });
      // create company if doesnt exist
      if (!companyDb) {
        const newCompany = this.companyRepository.create({
          title: body.companyName,
        });
        await this.companyRepository.save(newCompany);
        company = newCompany;
      }
      company = companyDb ?? undefined;
    }
    delete body.companyName;
    const newTask: Courses = this.coursesRepository.create({
      ...body,
      company,
    });
    return await this.coursesRepository.save(newTask);
  }

  async findById(id: string): Promise<Courses> {
    return await this.coursesRepository.findOne({
      where: { id },

      relations: [
        'categories',
        'creator',
        'exams',
        'exams.questions',
        'purchases',
        'language',
      ],
    });
  }

  findByTitle(title: string): Promise<Courses> {
    return this.coursesRepository.findOne({
      where: { title },
      relations: [
        'categories',
        'creator',
        'exams',
        'exams.questions',
        'language',
        'purchases',
      ],
    });
  }

  findAll(): Promise<Courses[]> {
    return this.coursesRepository.find({
      relations: ['categories', 'creator', 'language'],
    });
  }

  findCourseByCategory(categoryId: number): Promise<Courses[]> {
    // find course by category relation
    return this.coursesRepository.find({
      where: { categories: { id: categoryId } },
      relations: ['categories', 'creator', 'language'],
    });
  }

  async update(courseId: string, data: any) {
    const course = await this.findById(courseId);
    // for each property of data check if it exists and update it
    Object.keys(data).forEach((key) => {
      if (course[key]) {
        course[key] = data[key];
      }
    });
    course.categories = [];
    await this.coursesRepository.save(course);
    course.categories = data.categoryIds;

    return await this.coursesRepository.save(course);
  }

  async delete(courseId: string) {
    const course = await this.findById(courseId);
    course.exams.forEach(async (exam) => {
      await this.coursesExamService.delete(exam.id);
    });
    course.purchases.forEach(async (purchase) => {
      await this.purchaseService.delete(purchase.id);
    });
    return await this.coursesRepository.remove(course);
  }

  async addExam(courseId: string, examData: CreateCourseExamDto) {
    const course = await this.findById(courseId);

    const exam = await this.coursesExamService.create(examData);

    course.exams.push(exam);

    return await this.coursesRepository.save(course);
  }

  async getExams(courseId: string) {
    const course = await this.findById(courseId);
    if (!course?.exams) return [];
    return course.exams;
  }

  async getExam(courseId: string, examId: string) {
    const course = await this.findById(courseId);
    return course.exams.find((exam) => exam.id === examId);
  }

  async deleteExam(courseId: string, examId: string) {
    const course = await this.findById(courseId);
    course.exams = course.exams.filter((exam) => exam.id !== examId);

    // delete exam from database
    await this.coursesExamService.delete(examId);

    return await this.coursesRepository.save(course);
  }

  async correctExam(courseId: string, examId: string, answers: any) {
    const exam = await this.getExam(courseId, examId);

    // check if all answers are correct
    const correctAnswers = exam.questions.map((question) => {
      return question.correctAnswerId === answers[question.id];
    });

    // reduce correct answers to a single object with question id as key
    const correctAnswersObject = exam.questions.reduce((acc, question) => {
      acc[question.id] = question.answers.find(
        (answer) => answer.id === question.correctAnswerId,
      ).answer;
      return acc;
    }, {});

    // calculate score
    const score = correctAnswers.filter((answer) => answer === true).length;

    // average score
    const averageScore = score / exam.questions.length;

    return {
      examName: exam.name,
      avgScore: averageScore,
      correctAnswers: correctAnswersObject,
    };
  }
}
