import { Injectable } from '@nestjs/common';
import { Categories } from './categories.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  findById(id: number): Promise<Categories> {
    return this.categoriesRepository.findOneBy({ id });
  }

  getAll(): Promise<Categories[]> {
    return this.categoriesRepository.find();
  }
}
