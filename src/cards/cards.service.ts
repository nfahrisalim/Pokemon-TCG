import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Card } from './card.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
  ) {}

  findAll(searchQuery?: string): Promise<Card[]> {
    if (searchQuery) {
      return this.cardsRepository.find({
        where: { name: Like(`%${searchQuery}%`) },
        relations: { set: true },
      });
    }
    return this.cardsRepository.find({ relations: { set: true } });
  }

  findOne(id: number): Promise<Card | null> {
    return this.cardsRepository.findOne({
      where: { id },
      relations: { set: true },
    });
  }
}