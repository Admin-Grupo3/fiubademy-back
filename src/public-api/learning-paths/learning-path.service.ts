import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LearningPaths } from './learning-paths.entity';
import { CreateLearningPathDto } from './dtos/CreateLearningPath';

@Injectable()
export class LearningPathService {
  constructor(
    @InjectRepository(LearningPaths)
    private readonly learningPathRepository: Repository<LearningPaths>,
  ) {}

  async create(body: CreateLearningPathDto) {
    const newTask: LearningPaths = this.learningPathRepository.create(body);
    return await this.learningPathRepository.save(newTask);
  }

  async findById(id: string): Promise<LearningPaths> {
    return await this.learningPathRepository.findOne({
      where: { id },
      relations: ['courses', 'creator'],
    });
  }

  async findByTitle(title: string): Promise<LearningPaths> {
    return await this.learningPathRepository.findOne({
      where: { title },
      relations: ['courses', 'creator'],
    });
  }

  async findAll(): Promise<LearningPaths[]> {
    return await this.learningPathRepository.find({
      relations: ['courses', 'creator'],
    });
  }
}
