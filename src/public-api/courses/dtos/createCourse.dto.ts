import { Categories } from 'src/public-api/categories/categories.entity';
import { Languages } from 'src/public-api/languages/languages.entity';
import { Users } from 'src/public-api/users/users.entity';

export class CreateCourseDto {
  title: string;

  creator: Users;

  categories: Categories[];

  language: Languages;

  description: string;

  price: number;

  what_will_you_learn: string[];

  content: string[];

  video: string;

  companyName: string;
}
