import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Card } from '../cards/card.entity';

@Entity('subtype')
export class Subtype {
  @PrimaryColumn('int')
  subtype_id!: number;

  @Column('varchar', { length: 100 })
  subtype!: string;

  @Column('varchar', { length: 50, name: 'card_id' })
  card_id!: string;

  @ManyToOne(() => Card, (card) => card.subtypes)
  @JoinColumn({ name: 'card_id' })
  card!: Card;
}
