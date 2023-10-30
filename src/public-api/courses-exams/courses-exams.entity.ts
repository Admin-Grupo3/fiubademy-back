import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { CoursesQuestions } from './courses-questions/courses-questions.entity';
import { Courses } from '../courses/courses.entity';

@Entity('courses-exams')
export class CoursesExams extends BaseEntity {
  @Column({ type: 'uuid', primary: true, generated: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: '' })
  description: string;

  @ManyToOne(() => Courses, (course) => course.exams)
  course: Courses;

  @OneToMany(() => CoursesQuestions, (question) => question.exam)
  questions: CoursesQuestions[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
