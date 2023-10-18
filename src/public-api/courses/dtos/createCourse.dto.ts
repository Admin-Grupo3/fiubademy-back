import { Categories } from 'src/public-api/categories/categories.entity';
import { Languages } from 'src/public-api/languages/languages.entity';
import { Users } from 'src/public-api/users/users.entity';

export class CreateCourseDto {
  title: string;

  user: Users;

  categories: Categories[];

  language: Languages;
}
