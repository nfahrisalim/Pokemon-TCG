import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Card } from '../cards/card.entity';

@Entity('supertype')
export class Supertype {
  @PrimaryColumn('int')
  supertype_id!: number;

  @Column('varchar', { length: 50 })
  supertype!: string;

  @OneToMany(() => Card, (card) => card.supertype)
  cards!: Card[];
}
