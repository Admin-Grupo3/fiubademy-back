import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';

import { Categories } from '../categories/categories.entity';
import { Users } from '../users/users.entity';
import { Languages } from '../languages/languages.entity';
import { CoursesExams } from '../courses-exams/courses-exams.entity';
import { Purchases } from '../purchases/purchases.entity';
import { Company } from '../company/company.entity';

@Entity('courses')
export class Courses extends BaseEntity {
  @Column({ type: 'uuid', primary: true, generated: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: '' })
  description: string;

  @Column('int', { default: 0 })
  rating_count: number;

  @Column('int', { default: 0 })
  rating_star: number;

  @Column('float', { default: 0 })
  price: number;

  @Column('float', { default: 0 })
  discount: number;

  @ManyToOne(() => Users, (creator) => creator.id)
  creator: Users;

  @ManyToOne(() => Languages, (language) => language.id)
  language: Languages;

  @ManyToMany(() => Categories, (category) => category.id)
  @JoinTable()
  categories: Categories[];

  @ManyToOne(() => Company, (company) => company.courses)
  company: Company;

  @Column({ type: 'varchar', length: 255, nullable: true, default: '' })
  image: string;

  @Column('varchar', { array: true, default: '{}' })
  what_will_you_learn: string[];

  @Column('varchar', { array: true, default: '{}' })
  content: string[];

  @OneToMany(() => CoursesExams, (exam) => exam.course)
  @JoinTable()
  exams: CoursesExams[];

  @OneToMany(() => Purchases, (purchase) => purchase.course)
  purchases: Purchases[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
