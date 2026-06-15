import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Card } from '../cards/card.entity';

@Entity('sets')
export class Set {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  releaseDate!: string;

  @OneToMany(() => Card, (card) => card.set)
  cards!: Card[];
}