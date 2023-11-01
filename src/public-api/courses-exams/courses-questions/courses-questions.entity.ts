import { BaseEntity, Entity, Column, ManyToOne } from 'typeorm';
import { CoursesExams } from '../courses-exams.entity';

@Entity('courses-questions')
export class CoursesQuestions extends BaseEntity {
  @Column({ type: 'uuid', primary: true, generated: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  question: string;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  answers: { id: string; answer: string }[];

  @ManyToOne(() => CoursesExams, (exam) => exam.questions)
  exam: CoursesExams;

  @Column({ type: 'varchar', length: 255 })
  correctAnswerId: string;
}
