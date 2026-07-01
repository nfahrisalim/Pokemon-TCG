import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Set } from './set.entity';

@Injectable()
export class SetsService {
  constructor(
    @InjectRepository(Set)
    private setsRepository: Repository<Set>,
  ) {}

  findAll(searchQuery?: string): Promise<Set[]> {
    if (searchQuery) {
      return this.setsRepository.find({
        where: { set_name: Like(`%${searchQuery}%`) },
      });
    }
    return this.setsRepository.find();
  }

  findOne(id: string): Promise<Set | null> {
    return this.setsRepository.findOne({
      where: { set_id: id },
      relations: { cards: true },
    });
  }
}