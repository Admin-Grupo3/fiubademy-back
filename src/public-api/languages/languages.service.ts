import { Injectable } from '@nestjs/common';
import { Languages } from '../courses/courses.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Languages)
    private readonly languagesRepository: Repository<Languages>,
  ) {}

  findById(id: number): Promise<Languages> {
    return this.languagesRepository.findOneBy({ id });
  }
}
