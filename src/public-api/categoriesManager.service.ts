import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CategoriesService } from './categories/categories.service';

@Injectable()
export class CategoriesManagerService {
  private logger = new Logger(this.constructor.name);
  constructor(private readonly categoriesService: CategoriesService) {}

  async getAllCategories() {
    const categories = await this.categoriesService.getAll();

    return {
      categoriesData: JSON.stringify(categories),
    };
  }
  async createCategory(name: string): Promise<any> {
    let category = await this.categoriesService.findByTitle(name);
    if (category) {
      throw new HttpException(
        'category already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    category = await this.categoriesService.create(name);

    const categoryData = {
      category,
    };

    return {
      categoryData: JSON.stringify(categoryData),
    };
  }
}
