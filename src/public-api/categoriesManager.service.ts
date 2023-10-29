import { Injectable, Logger } from '@nestjs/common';
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
}
