import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Courses } from '../courses/courses.entity';
import { Users } from '../users/users.entity';

@Entity('courses_rating')
export class CoursesRating extends BaseEntity {
  @Column({ type: 'uuid', primary: true, generated: 'uuid' })
  id: string;

  @Column('int', { default: 0 })
  rating_star: number;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;

  @ManyToOne(() => Courses, (course) => course.id)
  course: Courses;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
