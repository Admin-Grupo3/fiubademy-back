import { Injectable } from '@nestjs/common';
import { Courses } from './courses.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCourseDto } from './dtos/createCourse.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,
  ) {}

  async create(body: CreateCourseDto) {
    const newTask: Courses = this.coursesRepository.create(body);
    return await this.coursesRepository.save(newTask);
  }

  async findById(id: string): Promise<Courses> {
    console.log(
      await this.coursesRepository.findOne({
        where: { id },
        relations: ['categories', 'creator', 'purchases'],
      }),
    );
    return this.coursesRepository.findOne({
      where: { id },
      relations: ['categories', 'creator', 'purchases'],
    });
  }

  findByTitle(title: string): Promise<Courses> {
    return this.coursesRepository.findOne({
      where: { title },
      relations: ['categories'],
    });
  }

  findAll(): Promise<Courses[]> {
    return this.coursesRepository.find({
      relations: ['categories', 'creator'],
    });
  }

  findCourseByCategory(categoryId: number): Promise<Courses[]> {
    // find course by category relation
    return this.coursesRepository.find({
      where: { categories: { id: categoryId } },
      relations: ['categories'],
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
}
