import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Courses } from '../courses/courses.entity';

export const ROLES = {
  STANDARD_USER: 'standard-user',
  ADMIN: 'admin',
};
@Entity('users')
export class Users extends BaseEntity {
  @Column({ type: 'uuid', primary: true, generated: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: unknown;

  @Column({ type: 'simple-array', default: ROLES.STANDARD_USER })
  roles: keyof (typeof ROLES)[];

  @OneToMany(() => Courses, (course) => course.id)
  myCourses: Courses[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
