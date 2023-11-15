import { Courses } from 'src/public-api/courses/courses.entity';
import { Users } from 'src/public-api/users/users.entity';

export class CreateLearningPathDto {
  title: string;
  description: string;
  courses: Courses[];
  creator: Users;
}
