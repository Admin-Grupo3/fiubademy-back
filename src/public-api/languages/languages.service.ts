import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Languages } from './languages.entity';

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
