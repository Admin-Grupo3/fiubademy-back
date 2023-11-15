import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchases } from './purchases.entity';
import { CreatePurchaseDto } from './dtos/createPurchase.dto';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchases)
    private readonly purchasesRepository: Repository<Purchases>,
  ) {}

  async create(purchaseData: CreatePurchaseDto) {
    const newPurchase: Purchases =
      this.purchasesRepository.create(purchaseData);
    return await this.purchasesRepository.save(newPurchase);
  }

  findByUserId(userId: string): Promise<Purchases[]> {
    return this.purchasesRepository.find({
      where: { user: { id: userId } },
      relations: ['course'],
    });
  }

  async delete(id: number) {
    const purchase = await this.purchasesRepository.findOne({
      where: { id },
    });
    return await this.purchasesRepository.remove(purchase);
  }
}
