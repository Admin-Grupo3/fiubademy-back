import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToOne,
  ManyToMany,
} from 'typeorm';

import { Courses } from '../courses/courses.entity';
import { Users } from '../users/users.entity';

@Entity('learning-paths')
export class LearningPaths extends BaseEntity {
  @Column({ type: 'uuid', primary: true, generated: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: '' })
  description: string;

  @ManyToMany(() => Courses, (course) => course.id)
  @JoinTable()
  courses: Courses[];

  @ManyToOne(() => Users, (creator) => creator.id)
  creator: Users;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
