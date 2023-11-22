import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CoursesOpinions } from './courseOpinions.entity';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class CoursesOpinionsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly courseService: CoursesService,
    @InjectRepository(CoursesOpinions)
    private readonly coursesOpinionsRepository: Repository<CoursesOpinions>,
  ) {}

  async create(userId: string, courseId: string, opinion: string) {
    const newOpinion: CoursesOpinions = this.coursesOpinionsRepository.create();
    newOpinion.opinion = opinion;
    newOpinion.user = await this.usersService.findById(userId);
    newOpinion.course = await this.courseService.findById(courseId);
    return await this.coursesOpinionsRepository.save(newOpinion);
  }

  findOpinionByUserId(
    user_id: string,
    course_id: string,
  ): Promise<CoursesOpinions[]> {
    return this.coursesOpinionsRepository.find({
      where: { user: { id: user_id }, course: { id: course_id } },
      relations: ['user', 'course'],
    });
  }

  getAllById(courseId: string): Promise<CoursesOpinions[]> {
    return this.coursesOpinionsRepository.find({
      where: { course: { id: courseId } },
      relations: ['user'],
    });
  }

  async updateOrCreate(userId: string, courseId: string, opinion: string) {
    const existingOpinion = await this.findOpinionByUserId(userId, courseId);
    if (existingOpinion.length === 0) {
      return this.create(userId, courseId, opinion);
    } else return this.update(existingOpinion[0], opinion);
  }

  async update(CourseOpinion: CoursesOpinions, opinion: string) {
    const newOpinion = opinion;
    const opinion_id = CourseOpinion.id;
    return await this.coursesOpinionsRepository.update(opinion_id, {
      opinion: newOpinion,
    });
  }
}
