import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToOne,
  ManyToMany,
} from 'typeorm';

import { Categories } from '../categories/categories.entity';
import { Users } from '../users/users.entity';

@Entity('languages')
export class Languages extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('courses')
export class Courses extends BaseEntity {
  @Column({ type: 'uuid', primary: true, generated: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  title: string;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;

  @ManyToOne(() => Languages, (language) => language.id)
  language: Languages;

  @ManyToMany(() => Categories, (category) => category.id)
  @JoinTable()
  categories: Categories[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
