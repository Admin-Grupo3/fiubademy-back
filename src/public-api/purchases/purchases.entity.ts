import { Courses } from 'src/public-api/courses/courses.entity';
import { Users } from 'src/public-api/users/users.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('purchases')
export class Purchases extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;

  @ManyToOne(() => Courses, (course) => course.id)
  course: Courses;

  @CreateDateColumn()
  purchaseDate: Date;
}
