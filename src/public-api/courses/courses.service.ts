import { Injectable } from '@nestjs/common';
import { Courses } from './courses.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCourseDto } from './dtos/createCourse.dto';
import { CoursesExamService } from '../courses-exams/courses-exams.service';
import { CreateCourseExamDto } from '../courses-exams/dtos/CreateCourseExam';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,
    private coursesExamService: CoursesExamService,
  ) {}

  async create(body: CreateCourseDto) {
    const newTask: Courses = this.coursesRepository.create(body);
    return await this.coursesRepository.save(newTask);
  }

  async findById(id: string): Promise<Courses> {
    return await this.coursesRepository.findOne({
      where: { id },
      relations: ['categories', 'creator', 'exams', 'exams.questions', 'purchases', 'language'],
    });
  }

  findByTitle(title: string): Promise<Courses> {
    return this.coursesRepository.findOne({
      where: { title },
      relations: ['categories', 'creator', 'exams', 'exams.questions', 'language', 'purchases'],
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
    return await this.coursesRepository.save(course);
  }

  async delete(courseId: string) {
    const course = await this.findById(courseId);
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
}
