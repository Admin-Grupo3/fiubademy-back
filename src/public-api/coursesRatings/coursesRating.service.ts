import { Injectable } from '@nestjs/common';
import { CoursesRating } from './coursesRating.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RatingCreateRequest } from '../controllers/coursesRatings/dtos/RatingCreateRequest';
import { Users } from '../users/users.entity';
import { Courses } from '../courses/courses.entity';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';

export class CreateRatingDto {
  user: Users;

  course: Courses;

  rating_star: number;
}

@Injectable()
export class CoursesRatingService {
  constructor(
    private readonly usersService: UsersService,
    private readonly courseService: CoursesService,
    @InjectRepository(CoursesRating)
    private readonly coursesRatingRepository: Repository<CoursesRating>,
  ) {}

  findRatingByUserId(
    user_id: string,
    course_id: string,
  ): Promise<CoursesRating[]> {
    return this.coursesRatingRepository.find({
      where: { user: { id: user_id }, course: { id: course_id } },
      relations: ['user', 'course'],
    });
  }

  getAll(): Promise<CoursesRating[]> {
    return this.coursesRatingRepository.find();
  }

  getAllById(courseId: string): Promise<CoursesRating[]> {
    return this.coursesRatingRepository.find({
      where: { course: { id: courseId } },
      relations: ['user'],
    });
  }

  async create(userId: string, courseId: string, rating: number) {
    const newRating: CoursesRating = this.coursesRatingRepository.create();
    newRating.rating_star = rating;
    newRating.user = await this.usersService.findById(userId);
    newRating.course = await this.courseService.findById(courseId);
    return await this.coursesRatingRepository.save(newRating);
  }

  async updateOrCreate(userId: string, courseId: string, rating: number) {
    const existingRating = await this.findRatingByUserId(userId, courseId);
    if (existingRating.length === 0) {
      return this.create(userId, courseId, rating);
    } else return this.update(existingRating[0], rating);
  }

  async update(rating: CoursesRating, rating_star: number) {
    rating.rating_star = rating_star;
    return await this.coursesRatingRepository.save(rating);
  }
}
