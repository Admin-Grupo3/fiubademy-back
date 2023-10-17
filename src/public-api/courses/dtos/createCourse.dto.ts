import { Categories } from 'src/public-api/categories/categories.entity';
import { Users } from 'src/public-api/users/users.entity';
import { Languages } from '../courses.entity';

export class CreateCourseDto {
  title: string;

  user: Users;

  categories: Categories[];

  language: Languages;
}
