import { Injectable } from '@nestjs/common';
import { Categories } from './categories.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesService {
  async create(name: string) {
    const newTask: Categories = this.categoriesRepository.create({ name });
    return await this.categoriesRepository.save(newTask);
  }
  findByTitle(name: string) {
    return this.categoriesRepository.findOne({
      where: { name },
    });
  }
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
