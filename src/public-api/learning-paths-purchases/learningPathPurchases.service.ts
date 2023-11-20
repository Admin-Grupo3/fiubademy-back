import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LearningPathPurchases } from './learningPathPurchases.entity';
import { CreateLearningPathPurchaseDto } from './dtos/createLearningPathPurchase.dto';

@Injectable()
export class LearningPathPurchasesService {
  constructor(
    @InjectRepository(LearningPathPurchases)
    private readonly learningPathPurchasesRepository: Repository<LearningPathPurchases>,
  ) {}

  async create(body: CreateLearningPathPurchaseDto) {
    const newPurchase: LearningPathPurchases =
      this.learningPathPurchasesRepository.create(body);

    return await this.learningPathPurchasesRepository.save(newPurchase);
  }

  findByUserId(userId: string): Promise<LearningPathPurchases[]> {
    return this.learningPathPurchasesRepository.find({
      where: { user: { id: userId } },
      relations: ['learningPath', 'learningPath.courses'],
    });
  }
}
