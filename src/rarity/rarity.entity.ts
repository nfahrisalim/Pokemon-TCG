import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Card } from '../cards/card.entity';

@Entity('rarity')
export class Rarity {
  @PrimaryColumn('int')
  rarity_id!: number;

  @Column('varchar', { length: 50 })
  rarity!: string;

  @OneToMany(() => Card, (card) => card.rarity)
  cards!: Card[];
}
