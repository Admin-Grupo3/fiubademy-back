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

  findByTitle(title: string): Promise<Courses> {
    return this.coursesRepository.findOneBy({ title });
  }
}
