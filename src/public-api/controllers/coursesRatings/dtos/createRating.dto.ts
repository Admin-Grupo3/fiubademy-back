import { Courses } from 'src/public-api/courses/courses.entity';
import { Users } from 'src/public-api/users/users.entity';

export class CreateRatingDto {
  user: Users;

  course: Courses;

  rating_star: number;
}
