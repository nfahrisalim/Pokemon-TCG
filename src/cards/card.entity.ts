import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Set } from '../sets/set.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  hp!: number;

  @ManyToOne(() => Set, (set) => set.cards)
  set!: Set;
}