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
        where: { card_name: Like(`%${searchQuery}%`) },
        relations: { set: true },
      });
    }
    return this.cardsRepository.find({ relations: { set: true } });
  }

  findOne(id: string): Promise<Card | null> {
    return this.cardsRepository.findOne({
      where: { card_id: id },
      relations: { set: true },
    });
  }
}